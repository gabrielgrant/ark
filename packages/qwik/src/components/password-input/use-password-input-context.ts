import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UsePasswordInputReturn } from './use-password-input.ts'

export interface PasswordInputApiStore extends ApiStore<UsePasswordInputReturn> {}

export const [PasswordInputProvider, usePasswordInputStore] = createContext<PasswordInputApiStore>({
  name: 'ark.password-input',
  hookName: 'usePasswordInputContext',
  providerName: '<PasswordInput.Root />',
})

export interface UsePasswordInputContext extends UsePasswordInputReturn {}

export const usePasswordInputContext = (): UsePasswordInputReturn | undefined => usePasswordInputStore().api
