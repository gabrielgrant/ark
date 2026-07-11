import type { ItemState } from '@zag-js/cascade-select'
import { useStore } from '@qwik.dev/core'
import { createContext } from '../../utils/create-context.ts'

/**
 * Item-level context (R2 companion): `ItemState` is plain serializable data
 * (no closures), so it does not need `noSerialize` -- but it is still wrapped
 * in a `useStore` that is rewritten on every render of
 * `<CascadeSelect.ItemProvider>`, so consumers deep in the tree that read it
 * during their own render stay subscribed and up to date (mirrors
 * `tree-view`'s node-state store).
 */
export interface CascadeSelectItemStore {
  state: ItemState | undefined
}

export const [CascadeSelectItemStateProvider, useCascadeSelectItemStore] = createContext<CascadeSelectItemStore>({
  name: 'ark.cascade-select-item',
  hookName: 'useCascadeSelectItemContext',
  providerName: '<CascadeSelect.ItemProvider />',
})

export interface UseCascadeSelectItemContext extends ItemState {}

export const useCascadeSelectItemContext = (): ItemState | undefined => useCascadeSelectItemStore().state

export const useCascadeSelectItemStoreValue = (state: ItemState | undefined): CascadeSelectItemStore => {
  const store = useStore<CascadeSelectItemStore>({ state })
  store.state = state
  return store
}
