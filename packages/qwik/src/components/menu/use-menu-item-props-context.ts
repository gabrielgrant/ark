import type { ItemBaseProps } from '@zag-js/menu'
import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'

/**
 * Internal context carrying the static item props a `<Menu.Item>` /
 * `<Menu.CheckboxItem>` / `<Menu.RadioItem>` was given, so its sub-parts
 * (ItemText/ItemIndicator) can call the main api's `getItemXProps(itemProps)`
 * without needing the props threaded through manually. The `Menu.Item`
 * variant additionally stashes its `onSelect` callback here for
 * `addItemListener` (see `menu-item.tsx`) -- since that makes this a
 * potential closure carrier, it is wrapped in the `noSerialize` store shape
 * (R2) rather than passed as a plain context value (unlike listbox/select's
 * item-props contexts, which are closure-free). Not exported from the public
 * `index.ts` (mirrors solid/react).
 */
export interface MenuItemPropsValue extends ItemBaseProps {
  onSelect?: VoidFunction
}

export interface MenuItemPropsStore extends ApiStore<MenuItemPropsValue> {}

export const [MenuItemPropsProvider, useMenuItemPropsStore] = createContext<MenuItemPropsStore>({
  name: 'ark.menu-item-props',
  hookName: 'useMenuItemPropsContext',
  providerName: '<Menu.Item />',
})

export const useMenuItemPropsContext = (): MenuItemPropsValue | undefined => useMenuItemPropsStore().api
