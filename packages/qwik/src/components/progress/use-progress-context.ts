import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseProgressReturn } from './use-progress.ts'

export interface ProgressApiStore extends ApiStore<UseProgressReturn> {}

export const [ProgressProvider, useProgressStore] = createContext<ProgressApiStore>({
  name: 'ark.progress',
  hookName: 'useProgressContext',
  providerName: '<Progress.Root />',
})

export interface UseProgressContext extends UseProgressReturn {}

export const useProgressContext = (): UseProgressReturn | undefined => useProgressStore().api
