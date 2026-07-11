import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseTabsReturn } from './use-tabs.ts'

export interface TabsApiStore extends ApiStore<UseTabsReturn> {}

export const [TabsProvider, useTabsStore] = createContext<TabsApiStore>({
  name: 'ark.tabs',
  hookName: 'useTabsContext',
  providerName: '<Tabs.Root />',
})

export interface UseTabsContext extends UseTabsReturn {}

export const useTabsContext = (): UseTabsReturn | undefined => useTabsStore().api
