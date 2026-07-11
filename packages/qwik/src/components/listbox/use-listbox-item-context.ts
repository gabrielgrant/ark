import type { ItemState } from '@zag-js/listbox'
import { useStore } from '@qwik.dev/core'
import { createContext } from '../../utils/create-context.ts'

/**
 * Item-level context (R2 companion): `ItemState` is plain serializable data
 * (no closures), so it does not need `noSerialize` -- but it is still wrapped
 * in a `useStore` that is rewritten on every render of `<Listbox.Item>`, so
 * consumers deep in the tree that read it during their own render stay
 * subscribed and up to date.
 */
export interface ListboxItemStore {
  state: ItemState | undefined
}

export const [ListboxItemProvider, useListboxItemStore] = createContext<ListboxItemStore>({
  name: 'ark.listbox-item',
  hookName: 'useListboxItemContext',
  providerName: '<Listbox.Item />',
})

export interface UseListboxItemContext extends ItemState {}

export const useListboxItemContext = (): ItemState | undefined => useListboxItemStore().state

export const useListboxItemStoreValue = (state: ItemState | undefined): ListboxItemStore => {
  const store = useStore<ListboxItemStore>({ state })
  store.state = state
  return store
}
