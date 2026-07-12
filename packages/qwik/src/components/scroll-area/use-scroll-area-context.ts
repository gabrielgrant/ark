import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseScrollAreaReturn } from './use-scroll-area.ts'

export interface ScrollAreaApiStore extends ApiStore<UseScrollAreaReturn> {}

export const [ScrollAreaProvider, useScrollAreaStore] = createContext<ScrollAreaApiStore>({
  name: 'ark.scroll-area',
  hookName: 'useScrollAreaContext',
  providerName: '<ScrollArea.Root />',
})

export interface UseScrollAreaContext extends UseScrollAreaReturn {}

export const useScrollAreaContext = (): UseScrollAreaReturn | undefined => useScrollAreaStore().api
