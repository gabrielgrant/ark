import type { ItemState } from '@zag-js/combobox'
import { useStore } from '@qwik.dev/core'
import { createContext } from '../../utils/create-context.ts'

/**
 * Item-level context (R2 companion): `ItemState` is plain serializable data
 * (no closures), so it does not need `noSerialize` -- but it is still wrapped
 * in a `useStore` that is rewritten on every render of `<Combobox.Item>`, so
 * consumers deep in the tree that read it during their own render stay
 * subscribed and up to date.
 */
export interface ComboboxItemStore {
  state: ItemState | undefined
}

export const [ComboboxItemProvider, useComboboxItemStore] = createContext<ComboboxItemStore>({
  name: 'ark.combobox-item',
  hookName: 'useComboboxItemContext',
  providerName: '<Combobox.Item />',
})

export interface UseComboboxItemContext extends ItemState {}

export const useComboboxItemContext = (): ItemState | undefined => useComboboxItemStore().state

export const useComboboxItemStoreValue = (state: ItemState | undefined): ComboboxItemStore => {
  const store = useStore<ComboboxItemStore>({ state })
  store.state = state
  return store
}
