import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseFieldsetReturn } from './use-fieldset.ts'

export interface FieldsetApiStore extends ApiStore<UseFieldsetReturn> {}

export const [FieldsetProvider, useFieldsetStore] = createContext<FieldsetApiStore | undefined>({
  name: 'ark.fieldset',
  hookName: 'useFieldsetContext',
  providerName: '<Fieldset.Root />',
  strict: false,
})

export interface UseFieldsetContext extends UseFieldsetReturn {}

export const useFieldsetContext = (): UseFieldsetReturn | undefined => useFieldsetStore()?.api
