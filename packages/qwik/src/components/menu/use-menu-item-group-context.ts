import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'

export interface MenuItemGroupValueChangeDetails {
  value: string
}

/**
 * Shared between `<Menu.ItemGroup>` (only `id` set) and
 * `<Menu.RadioItemGroup>` (`id` + `value` + `onValueChange`, a
 * framework-level convenience with no zag machine backing it). Carries an
 * optional callback, so it goes through the `noSerialize` store shape (R2)
 * like the other menu item contexts.
 */
export interface MenuItemGroupValue {
  id: string
  value?: string
  onValueChange?: (details: MenuItemGroupValueChangeDetails) => void
}

export interface MenuItemGroupStore extends ApiStore<MenuItemGroupValue> {}

export const [MenuItemGroupProvider, useMenuItemGroupStore] = createContext<MenuItemGroupStore>({
  name: 'ark.menu-item-group',
  hookName: 'useMenuItemGroupContext',
  providerName: '<Menu.ItemGroup />',
})

export const useMenuItemGroupContext = (): MenuItemGroupValue | undefined => useMenuItemGroupStore().api
