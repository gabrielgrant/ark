import type * as toast from '@zag-js/toast'
import { type JSXOutput, Slot, component$, noSerialize } from '@qwik.dev/core'
import { useApiStore } from '../../utils/use-api-store.ts'
import { ToastProvider } from './use-toast-context.ts'
import { useToast } from './use-toast.ts'

export interface ToastActorProps {
  value: toast.Props
  parent: toast.GroupService
  index: number
  children?: JSXOutput
}

/**
 * Owns one toast's machine + context, mirroring the `ToastActor` helper in
 * the Solid/React ports. Rendered once per item in the group's `toasts` list
 * (keyed by id — see `toaster.tsx`); `value` and `parent` are non-serializable
 * (the group's toast item can carry an `action.onClick` closure; `parent` is
 * the group's own machine service) so they are `noSerialize`-tagged here
 * before use, following the R15 class-instance-prop pattern.
 */
export const ToastActor = component$<ToastActorProps>((props) => {
  const value = props.value as unknown as Record<string, unknown>
  if (typeof value === 'object' && value !== null) noSerialize(value)
  if (typeof props.parent === 'object' && props.parent !== null) noSerialize(props.parent)

  const api = useToast(() => ({
    ...(value as unknown as toast.Props),
    parent: props.parent,
    index: props.index,
  }))

  const store = useApiStore(api)
  ToastProvider(store)

  return <Slot />
})
