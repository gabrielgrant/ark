import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseAvatarReturn } from './use-avatar.ts'

export interface AvatarApiStore extends ApiStore<UseAvatarReturn> {}

export const [AvatarProvider, useAvatarStore] = createContext<AvatarApiStore>({
  name: 'ark.avatar',
  hookName: 'useAvatarContext',
  providerName: '<Avatar.Root />',
})

export interface UseAvatarContext extends UseAvatarReturn {}

export const useAvatarContext = (): UseAvatarReturn | undefined => useAvatarStore().api
