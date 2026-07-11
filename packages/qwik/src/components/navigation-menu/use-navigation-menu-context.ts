import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseNavigationMenuReturn } from './use-navigation-menu.ts'

export interface NavigationMenuApiStore extends ApiStore<UseNavigationMenuReturn> {}

export const [NavigationMenuProvider, useNavigationMenuStore] = createContext<NavigationMenuApiStore>({
  name: 'ark.navigation-menu',
  hookName: 'useNavigationMenuContext',
  providerName: '<NavigationMenu.Root />',
})

export interface UseNavigationMenuContext extends UseNavigationMenuReturn {}

export const useNavigationMenuContext = (): UseNavigationMenuReturn | undefined => useNavigationMenuStore().api
