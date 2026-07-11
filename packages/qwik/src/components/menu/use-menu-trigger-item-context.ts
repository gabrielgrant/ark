import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'

/**
 * Carries a getter for the parent menu's `getTriggerItemProps(childApi)`
 * result (a plain DOM-props record, but one that embeds event-handler
 * closures) so `<Menu.TriggerItem>` -- rendered as a child of the SUBMENU's
 * `<Menu.Root>` -- can read props computed by the PARENT menu. Wrapped in the
 * `noSerialize` store shape (R2) since the record contains functions.
 */
export type MenuTriggerItemGetter = () => Record<string, unknown> | undefined

export interface MenuTriggerItemStore extends ApiStore<MenuTriggerItemGetter> {}

export const [MenuTriggerItemProvider, useMenuTriggerItemStore] = createContext<MenuTriggerItemStore | undefined>({
  name: 'ark.menu-trigger-item',
  hookName: 'useMenuTriggerItemContext',
  providerName: '<Menu.Root />',
  strict: false,
})

export const useMenuTriggerItemContext = (): MenuTriggerItemGetter | undefined => useMenuTriggerItemStore()?.api
