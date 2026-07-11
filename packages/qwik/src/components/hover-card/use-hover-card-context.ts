import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseHoverCardReturn } from './use-hover-card.ts'

export interface HoverCardApiStore extends ApiStore<UseHoverCardReturn> {}

export const [HoverCardProvider, useHoverCardStore] = createContext<HoverCardApiStore>({
  name: 'ark.hover-card',
  hookName: 'useHoverCardContext',
  providerName: '<HoverCard.Root />',
})

export interface UseHoverCardContext extends UseHoverCardReturn {}

export const useHoverCardContext = (): UseHoverCardReturn | undefined => useHoverCardStore().api
