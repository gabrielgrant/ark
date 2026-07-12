import type { JSXOutput } from '@qwik.dev/core'
import * as toast from '@zag-js/toast'

export interface CreateToasterProps extends Partial<toast.StoreProps> {
  placement: toast.Placement
}

/**
 * The returned store is a bag of closures (subscribe/create/dismiss/...) — not
 * serializable. It is meant to be created once (module scope, or inside a
 * component and tagged with `noSerialize` before use, mirroring the R15
 * class-instance-prop pattern) and passed into `<Toaster toaster={toaster}>`.
 * See `toaster.tsx` for the Qwik-specific SSR caveats.
 */
export interface CreateToasterReturn extends toast.Store<JSXOutput> {}

export const createToaster = (props: CreateToasterProps): CreateToasterReturn => {
  return toast.createStore(props)
}
