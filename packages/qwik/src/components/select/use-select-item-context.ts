import type { ItemState } from '@zag-js/select'
import { useStore } from '@qwik.dev/core'
import { createContext } from '../../utils/create-context.ts'

/**
 * Item-level context (R2 companion): `ItemState` is plain serializable data
 * (no closures), so it does not need `noSerialize` -- but it is still wrapped
 * in a `useStore` that is rewritten on every render of `<Select.Item>`, so
 * consumers deep in the tree that read it during their own render stay
 * subscribed and up to date.
 */
export interface SelectItemStore {
  state: ItemState | undefined
}

export const [SelectItemProvider, useSelectItemStore] = createContext<SelectItemStore>({
  name: 'ark.select-item',
  hookName: 'useSelectItemContext',
  providerName: '<Select.Item />',
})

export interface UseSelectItemContext extends ItemState {}

export const useSelectItemContext = (): ItemState | undefined => useSelectItemStore().state

export const useSelectItemStoreValue = (state: ItemState | undefined): SelectItemStore => {
  const store = useStore<SelectItemStore>({ state })
  store.state = state
  return store
}
