import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseToggleReturn } from './use-toggle.ts'

export interface ToggleApiStore extends ApiStore<UseToggleReturn> {}

export const [ToggleProvider, useToggleStore] = createContext<ToggleApiStore>({
  name: 'ark.toggle',
  hookName: 'useToggleContext',
  providerName: '<Toggle.Root />',
})

export interface UseToggleContext extends UseToggleReturn {}

export const useToggleContext = (): UseToggleReturn | undefined => useToggleStore().api
