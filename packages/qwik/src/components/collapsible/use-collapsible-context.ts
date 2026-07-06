import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseCollapsibleReturn } from './use-collapsible.ts'

export interface CollapsibleApiStore extends ApiStore<UseCollapsibleReturn> {}

export const [CollapsibleProvider, useCollapsibleStore] = createContext<CollapsibleApiStore>({
  name: 'ark.collapsible',
  hookName: 'useCollapsibleContext',
  providerName: '<Collapsible.Root />',
})

export interface UseCollapsibleContext extends UseCollapsibleReturn {}

export const useCollapsibleContext = (): UseCollapsibleReturn | undefined => useCollapsibleStore().api
