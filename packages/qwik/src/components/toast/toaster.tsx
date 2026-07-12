import type * as toast from '@zag-js/toast'
import { mergeProps } from '@zag-js/qwik'
import { type JSXOutput, component$, noSerialize } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import type { CreateToasterReturn } from './create-toaster.ts'
import { ToastActor } from './toast-actor.tsx'
import { useToastGroup } from './use-toast-group.ts'

export type ToastOptions = toast.Options<JSXOutput>

export interface ToasterBaseProps extends PolymorphicProps<'div'>, Omit<toast.GroupProps, 'id' | 'store'> {
  toaster: CreateToasterReturn
  /**
   * Renders a single toast's markup, given its options. Invoked synchronously
   * during `Toaster`'s own render (once per visible toast) — NOT a QRL, so it
   * is CSR-only (see the module doc comment below). Qwik has no
   * children-as-function idiom (PLAN.md R6); this is a deliberate exception,
   * mirroring the Solid/React `Toaster` `children` render-prop (needed
   * because each toast renders arbitrarily different content — title,
   * description, action, type all vary per item, so there is no single
   * static template to project via `<Slot>`).
   *
   * Named `renderToast` rather than `children`: Qwik's `component$` typing
   * intersects declared props with its own `children?: JSXChildren`
   * attribute, and that intersection collapses to `never` when the user's
   * own `children` field is a bare function type (confirmed empirically —
   * `<Foo>{(x) => ...}</Foo>` AND `<Foo children={(x) => ...} />` both fail
   * to typecheck against a `children: (x: T) => JSXOutput` prop, even though
   * `Function` is a member of the `JSXChildren` union at the value level).
   * Using any other prop name sidesteps the collision entirely.
   */
  renderToast: (toast: ToastOptions) => JSXOutput
}
export interface ToasterProps extends Assign<HTMLProps<'div'>, ToasterBaseProps> {}

/**
 * SSR / serialization caveats (PLAN.md R2/R15):
 * - `toaster` (the `createToaster` store) and `renderToast` (the render
 *   callback) are both non-serializable — bags of closures — yet arrive here
 *   as ordinary `component$` props. Both are `noSerialize`-tagged on every
 *   render before use, the same pattern `select-root.tsx` / `tree-view-root.tsx`
 *   use for the class-instance `collection` prop.
 * - In practice toasts are created imperatively from event handlers
 *   (`toaster.create(...)`), so the server almost always renders an empty
 *   group — there is nothing to serialize. If a true SSR-serialize-then-resume
 *   round trip occurs without this component re-rendering first, the tagged
 *   values deserialize as `undefined` (same caveat class as R9's plain
 *   callbacks). Prefer creating the toaster as a module-level singleton (a
 *   plain `const toaster = createToaster(...)` in its own module, imported
 *   wherever it's needed) so it never has to survive Qwik's serialization
 *   graph at all — this is the CSR-friendly usage this component is designed
 *   around.
 */
export const Toaster = component$<ToasterProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const toaster = record.toaster as CreateToasterReturn
  noSerialize(toaster)

  const renderToast = record.renderToast as (toastValue: ToastOptions) => JSXOutput
  noSerialize(renderToast)

  const group = useToastGroup(() => ({ store: toaster as unknown as toast.Store }))

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (key !== 'toaster' && key !== 'renderToast') rest[key] = record[key]
  }

  const groupProps = mergeProps(group.api.getGroupProps(), rest)
  const items = group.api.getToasts()

  return (
    <ark.div {...groupProps}>
      {items.map((item, index) => (
        <ToastActor key={item.id} value={item} parent={group.service} index={index}>
          {renderToast(item as ToastOptions)}
        </ToastActor>
      ))}
    </ark.div>
  )
})
