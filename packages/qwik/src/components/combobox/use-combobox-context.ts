import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { CollectionItem } from '../collection.ts'
import type { UseComboboxReturn } from './use-combobox.ts'

export interface ComboboxApiStore extends ApiStore<UseComboboxReturn<CollectionItem>> {}

export const [ComboboxProvider, useComboboxStore] = createContext<ComboboxApiStore>({
  name: 'ark.combobox',
  hookName: 'useComboboxContext',
  providerName: '<Combobox.Root />',
})

export interface UseComboboxContext<T extends CollectionItem = CollectionItem> extends UseComboboxReturn<T> {}

export const useComboboxContext = <T extends CollectionItem = CollectionItem>(): UseComboboxReturn<T> | undefined =>
  useComboboxStore().api as UseComboboxReturn<T> | undefined
