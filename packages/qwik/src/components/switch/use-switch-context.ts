import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseSwitchReturn } from './use-switch.ts'

export interface SwitchApiStore extends ApiStore<UseSwitchReturn> {}

export const [SwitchProvider, useSwitchStore] = createContext<SwitchApiStore>({
  name: 'ark.switch',
  hookName: 'useSwitchContext',
  providerName: '<Switch.Root />',
})

export interface UseSwitchContext extends UseSwitchReturn {}

export const useSwitchContext = (): UseSwitchReturn | undefined => useSwitchStore().api
