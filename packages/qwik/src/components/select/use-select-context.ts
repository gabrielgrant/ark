import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { CollectionItem } from '../collection.ts'
import type { UseSelectReturn } from './use-select.ts'

export interface SelectApiStore extends ApiStore<UseSelectReturn<CollectionItem>> {}

export const [SelectProvider, useSelectStore] = createContext<SelectApiStore>({
  name: 'ark.select',
  hookName: 'useSelectContext',
  providerName: '<Select.Root />',
})

export interface UseSelectContext<T extends CollectionItem = CollectionItem> extends UseSelectReturn<T> {}

export const useSelectContext = <T extends CollectionItem = CollectionItem>(): UseSelectReturn<T> | undefined =>
  useSelectStore().api as UseSelectReturn<T> | undefined
