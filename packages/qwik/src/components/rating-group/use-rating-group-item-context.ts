import type { ItemState } from '@zag-js/rating-group'
import { useStore } from '@qwik.dev/core'
import { createContext } from '../../utils/create-context.ts'

/**
 * Item-level context: a second store context, keyed the same way as the main
 * `RatingGroupApiStore` (R2), carrying the per-item `ItemState` snapshot
 * (`highlighted`/`half`/`checked`). `ItemState` is plain serializable data (no
 * closures), so it does not need `noSerialize` — but it is still wrapped in a
 * `useStore` that is rewritten on every render of `<RatingGroup.Item>`, so
 * consumers deep in the tree that read it during their own render stay
 * subscribed and up to date.
 */
export interface RatingGroupItemStore {
  state: ItemState | undefined
}

export const [RatingGroupItemProvider, useRatingGroupItemStore] = createContext<RatingGroupItemStore>({
  name: 'ark.rating-group-item',
  hookName: 'useRatingGroupItemContext',
  providerName: '<RatingGroup.Item />',
})

export interface UseRatingGroupItemContext extends ItemState {}

export const useRatingGroupItemContext = (): ItemState | undefined => useRatingGroupItemStore().state

export const useRatingGroupItemStoreValue = (state: ItemState | undefined): RatingGroupItemStore => {
  const store = useStore<RatingGroupItemStore>({ state })
  store.state = state
  return store
}
