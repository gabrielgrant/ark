import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseDrawerReturn } from './use-drawer.ts'

/**
 * The machine `api` is a bag of non-serializable closures, so it is shared as a
 * `noSerialize` value inside a store created by `<Drawer.Root>` (see
 * `useApiStore`). Parts read `store.api` (subscribing) and re-render when the
 * owner recomputes it. `api` is `undefined` while the component is dormant
 * (pre-wake) on the client — parts must guard for it. See PLAN.md, rule R2.
 */
export interface DrawerApiStore extends ApiStore<UseDrawerReturn> {}

export const [DrawerProvider, useDrawerStore] = createContext<DrawerApiStore>({
  name: 'ark.drawer',
  hookName: 'useDrawerContext',
  providerName: '<Drawer.Root />',
})

export interface UseDrawerContext extends UseDrawerReturn {}

export const useDrawerContext = (): UseDrawerReturn | undefined => useDrawerStore().api
