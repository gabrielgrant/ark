import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseRadioGroupReturn } from './use-radio-group.ts'

export interface RadioGroupApiStore extends ApiStore<UseRadioGroupReturn> {}

export const [RadioGroupProvider, useRadioGroupStore] = createContext<RadioGroupApiStore>({
  name: 'ark.radio-group',
  hookName: 'useRadioGroupContext',
  providerName: '<RadioGroup.Root />',
})

export interface UseRadioGroupContext extends UseRadioGroupReturn {}

export const useRadioGroupContext = (): UseRadioGroupReturn | undefined => useRadioGroupStore().api
