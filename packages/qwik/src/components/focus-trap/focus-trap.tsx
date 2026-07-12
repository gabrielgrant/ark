import { type FocusTrapOptions, trapFocus } from '@zag-js/focus-trap'
import { type QRL, Slot, component$, useSignal, useVisibleTask$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'

export interface TrapOptions
  extends Pick<
    FocusTrapOptions,
    'initialFocus' | 'fallbackFocus' | 'returnFocusOnDeactivate' | 'setReturnFocus'
  > {
  /**
   * Whether the focus trap is disabled.
   */
  disabled?: boolean
  /**
   * Called before sending focus to the target element upon activation.
   * Plain function only -- the trap library invokes it synchronously.
   */
  onActivate?: () => void
  /** QRL variant of `onActivate` (fires after the plain callback, if any). */
  onActivate$?: QRL<() => void>
  /**
   * Called after the trap has released focus (deactivation).
   * Plain function only -- the trap library invokes it synchronously.
   */
  onDeactivate?: () => void
  /** QRL variant of `onDeactivate` (fires after the plain callback, if any). */
  onDeactivate$?: QRL<() => void>
}

export interface FocusTrapBaseProps extends PolymorphicProps<'div'>, TrapOptions {}
export interface FocusTrapProps extends Assign<HTMLProps<'div'>, FocusTrapBaseProps> {}

const ownKeySet = new Set<string>([
  'disabled',
  'onActivate',
  'onActivate$',
  'onDeactivate',
  'onDeactivate$',
  'initialFocus',
  'fallbackFocus',
  'returnFocusOnDeactivate',
  'setReturnFocus',
])

/**
 * `initialFocus`/`fallbackFocus`/`setReturnFocus` stay plain-function-only
 * (R12): the underlying `trapFocus` (`@zag-js/focus-trap`) calls them
 * synchronously to resolve the element to focus, so there is no
 * "compose both, fire-and-forget" QRL variant to offer for them, unlike
 * `onActivate`/`onDeactivate` (pure notifications).
 */
export const FocusTrap = component$<FocusTrapProps>((props) => {
  const record = props as unknown as Record<string, unknown>
  const nodeRef = useSignal<HTMLDivElement>()

  // biome-ignore lint/correctness/noQwikUseVisibleTask: trapFocus is a real DOM/focus-management operation with no SSR-computable equivalent (mirrors solid's onMount + cleanup)
  useVisibleTask$(({ track, cleanup }) => {
    const disabled = track(() => record.disabled as boolean | undefined)
    const node = nodeRef.value
    if (!node || disabled) return

    const autoFocusNode = node.querySelector<HTMLElement>('[autofocus], [data-autofocus]')

    const plainActivate = record.onActivate as (() => void) | undefined
    const qrlActivate = record.onActivate$ as QRL<() => void> | undefined
    const plainDeactivate = record.onDeactivate as (() => void) | undefined
    const qrlDeactivate = record.onDeactivate$ as QRL<() => void> | undefined

    const trapProps: FocusTrapOptions = {
      initialFocus: (record.initialFocus as FocusTrapOptions['initialFocus']) ?? autoFocusNode ?? undefined,
      fallbackFocus: record.fallbackFocus as FocusTrapOptions['fallbackFocus'],
      returnFocusOnDeactivate: record.returnFocusOnDeactivate as boolean | undefined,
      setReturnFocus: record.setReturnFocus as FocusTrapOptions['setReturnFocus'],
      onActivate: plainActivate || qrlActivate ? () => {
        plainActivate?.()
        void qrlActivate?.()
      } : undefined,
      onDeactivate: plainDeactivate || qrlDeactivate ? () => {
        plainDeactivate?.()
        void qrlDeactivate?.()
      } : undefined,
    }

    cleanup(trapFocus(node, trapProps))
  })

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  return (
    <ark.div {...rest} ref={nodeRef}>
      <Slot />
    </ark.div>
  )
})
