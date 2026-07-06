import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseFieldReturn } from './use-field.ts'

export interface FieldApiStore extends ApiStore<UseFieldReturn> {}

export const [FieldProvider, useFieldStore] = createContext<FieldApiStore | undefined>({
  name: 'ark.field',
  hookName: 'useFieldContext',
  providerName: '<Field.Root />',
  strict: false,
})

export interface UseFieldContext extends UseFieldReturn {}

export const useFieldContext = (): UseFieldReturn | undefined => useFieldStore()?.api
