import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UsePresenceReturn } from './use-presence.ts'

export interface PresenceApiStore extends ApiStore<UsePresenceReturn> {}

export const [PresenceProvider, usePresenceStore] = createContext<PresenceApiStore>({
  name: 'ark.presence',
  hookName: 'usePresenceContext',
  providerName: '<PresenceProvider />',
})

export interface UsePresenceContext extends UsePresenceReturn {}

export const usePresenceContext = (): UsePresenceReturn | undefined => usePresenceStore().api
