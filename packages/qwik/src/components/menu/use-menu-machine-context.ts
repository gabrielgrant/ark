import type * as menu from '@zag-js/menu'
import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'

/**
 * Carries the raw machine `service` (not just its connected `api`) so a
 * nested `<Menu.Root>` can read its ANCESTOR menu's service and register the
 * parent/child relationship (`api.setParent`/`parentApi.setChild`, see
 * `menu-root.tsx`). `service` is a non-serializable object (closures over
 * the machine's internals); reuses the same `noSerialize` store shape as
 * `use-api-store.ts` (R2) even though the field is semantically a "service"
 * rather than a connected "api".
 */
export interface MenuMachineStore extends ApiStore<menu.Service> {}

export const [MenuMachineProvider, useMenuMachineStore] = createContext<MenuMachineStore | undefined>({
  name: 'ark.menu-machine',
  hookName: 'useMenuMachineContext',
  providerName: '<Menu.Root />',
  strict: false,
})

export const useMenuMachineContext = (): menu.Service | undefined => useMenuMachineStore()?.api
