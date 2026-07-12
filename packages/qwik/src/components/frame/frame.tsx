import {
  type JSXOutput,
  type QRL,
  Slot,
  component$,
  useId,
  useSignal,
  useVisibleTask$,
} from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, ark } from '../factory.tsx'

export interface FrameBaseProps {
  /**
   * Additional content to be inserted into the frame's `<head>`.
   *
   * R7 caveat: unlike solid/react (which portal this into the iframe's own
   * `contentDocument.head` via a real cross-document portal), Qwik has no
   * cross-document portal primitive -- its event delegation is registered
   * against the top-level document only, so moving a rendered Qwik subtree
   * into the iframe's separate `Document` would silently lose interactivity
   * for anything inside it (event listeners are resolved by qwikloader
   * walking up the DOM to the container it is registered against, not the
   * iframe's). This prop is accepted for API parity but renders INLINE in
   * the main document (immediately after the `<iframe>`), not inside it.
   */
  head?: JSXOutput
  /**
   * See the `FrameProps` doc comment: children render inline in the main
   * document (via `<Slot/>`), not inside the iframe's own document.
   */
  children?: JSXOutput
  /** Callback function to be executed when the frame is mounted. */
  onMount?: () => void
  /** QRL variant of `onMount`. */
  onMount$?: QRL<() => void>
  /** Callback function to be executed when the frame is unmounted. */
  onUnmount?: () => void
  /** QRL variant of `onUnmount`. */
  onUnmount$?: QRL<() => void>
}

/**
 * R7 caveat: solid/react mount `children` INTO the iframe's own document via
 * a real DOM/framework portal (`Portal`/`createPortal`), so the projected
 * content is genuinely isolated (its own `<html>`, its own stylesheet scope).
 * Qwik cannot do this (see `head` above) -- `children` render inline in the
 * main document via `<Slot/>`, immediately after the `<iframe>` element, NOT
 * inside it. The iframe itself still gets a real, separate `Document` (via
 * `srcdoc`/`doc.write`) and the same auto-resize (`--width`/`--height` CSS
 * custom properties from a `ResizeObserver`) as the other frameworks; only
 * the "render arbitrary interactive content inside the iframe" capability is
 * the documented gap. Consumers who only need visual/style isolation for
 * STATIC markup can still pass it via `srcdoc` (a plain string, unaffected
 * by this gap).
 */
export interface FrameProps extends Assign<HTMLProps<'iframe'>, FrameBaseProps> {}

const resetStyle = '<style>*,*::before,*::after { margin: 0; padding: 0; box-sizing: border-box; }</style>'

const initialSrcDoc = `<html><head>${resetStyle}</head><body><div class="frame-root"></div></body></html>`

function getMountNode(frame: HTMLIFrameElement) {
  const doc = frame.contentWindow?.document
  if (!doc) return null
  return doc.body.querySelector<HTMLElement>('.frame-root') || doc.body
}

export const Frame = component$<FrameProps>((props) => {
  const record = props as unknown as Record<string, unknown>
  const autoId = useId()
  const frameRef = useSignal<HTMLIFrameElement>()

  const srcdoc = (record.srcdoc as string | undefined) ?? initialSrcDoc

  // biome-ignore lint/correctness/noQwikUseVisibleTask: writes the iframe's contentDocument and observes its size via ResizeObserver -- both browser-only APIs with no SSR-computable equivalent
  useVisibleTask$(({ cleanup }) => {
    const frame = frameRef.value
    if (!frame) return

    const doc = frame.contentWindow?.document
    if (!doc) return

    doc.open()
    doc.write(srcdoc)
    doc.close()

    const plainMount = record.onMount as (() => void) | undefined
    const qrlMount = record.onMount$ as QRL<() => void> | undefined
    plainMount?.()
    void qrlMount?.()

    const win = frame.contentWindow as (Window & typeof globalThis) | null
    const node = getMountNode(frame)
    if (win && node) {
      const exec = () => {
        win.requestAnimationFrame(() => {
          const rootEl = frame.contentDocument?.documentElement
          if (!rootEl) return
          frame.style.setProperty('--width', `${node.scrollWidth}px`)
          frame.style.setProperty('--height', `${node.scrollHeight}px`)
        })
      }

      const resizeObserver = new win.ResizeObserver(exec)
      exec()
      resizeObserver.observe(node)

      cleanup(() => resizeObserver.disconnect())
    }

    cleanup(() => {
      const plainUnmount = record.onUnmount as (() => void) | undefined
      const qrlUnmount = record.onUnmount$ as QRL<() => void> | undefined
      plainUnmount?.()
      void qrlUnmount?.()
    })
  })

  const ownKeySet = new Set(['head', 'onMount', 'onMount$', 'onUnmount', 'onUnmount$', 'children'])
  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }
  rest.srcdoc = srcdoc
  if (!rest.title) rest.title = `frame:${autoId}`

  return (
    <>
      <ark.iframe {...rest} ref={frameRef} />
      {record.head as JSXOutput}
      <Slot />
    </>
  )
})
