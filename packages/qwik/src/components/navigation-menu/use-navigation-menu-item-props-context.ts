import type { ItemProps } from '@zag-js/navigation-menu'
import { createContext } from '../../utils/create-context.ts'

/**
 * Internal context carrying the static `{ value, disabled }` props a
 * `<NavigationMenu.Item>` was given, so its sub-parts (Trigger/Content/Link/
 * ItemIndicator) can call the main api's `getXProps(itemProps)` without
 * needing the props threaded through manually. Plain serializable data
 * (like radio-group's `ItemPropsProvider`) -- no `noSerialize`/store wrapper
 * needed. `strict: false` (matches solid): Link/Content/ItemIndicator may be
 * used with an explicit `value` prop outside of an `<Item>` ancestor. Not
 * exported from the public `index.ts` (mirrors solid/react).
 */
export const [NavigationMenuItemPropsProvider, useNavigationMenuItemPropsContext] = createContext<ItemProps>({
  name: 'ark.navigation-menu-item-props',
  hookName: 'useNavigationMenuItemPropsContext',
  providerName: '<NavigationMenu.Item />',
  strict: false,
})
