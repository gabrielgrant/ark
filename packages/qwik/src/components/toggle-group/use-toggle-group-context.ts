import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseToggleGroupReturn } from './use-toggle-group.ts'

export interface ToggleGroupApiStore extends ApiStore<UseToggleGroupReturn> {}

export const [ToggleGroupProvider, useToggleGroupStore] = createContext<ToggleGroupApiStore>({
  name: 'ark.toggle-group',
  hookName: 'useToggleGroupContext',
  providerName: '<ToggleGroup.Root />',
})

export interface UseToggleGroupContext extends UseToggleGroupReturn {}

export const useToggleGroupContext = (): UseToggleGroupReturn | undefined => useToggleGroupStore().api
