import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { CollectionItem } from '../collection.ts'
import type { UseListboxReturn } from './use-listbox.ts'

export interface ListboxApiStore extends ApiStore<UseListboxReturn<CollectionItem>> {}

export const [ListboxProvider, useListboxStore] = createContext<ListboxApiStore>({
  name: 'ark.listbox',
  hookName: 'useListboxContext',
  providerName: '<Listbox.Root />',
})

export interface UseListboxContext<T extends CollectionItem = CollectionItem> extends UseListboxReturn<T> {}

export const useListboxContext = <T extends CollectionItem = CollectionItem>(): UseListboxReturn<T> | undefined =>
  useListboxStore().api as UseListboxReturn<T> | undefined
