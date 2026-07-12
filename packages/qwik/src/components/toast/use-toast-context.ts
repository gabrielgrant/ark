import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseToastReturn } from './use-toast.ts'

/**
 * Each `<Toast.Root>` instance (rendered by `ToastActor`, one per toast) owns
 * its own machine `api` — shared as a `noSerialize` value inside a store, per
 * PLAN.md rule R2. Parts read `store.api` (subscribing) and re-render when the
 * actor recomputes it; `api` is `undefined` while dormant pre-wake.
 */
export interface ToastApiStore extends ApiStore<UseToastReturn> {}

export const [ToastProvider, useToastStore] = createContext<ToastApiStore>({
  name: 'ark.toast',
  hookName: 'useToastContext',
  providerName: '<ToastActor />',
})

export interface UseToastContext extends UseToastReturn {}

export const useToastContext = (): UseToastReturn | undefined => useToastStore().api
