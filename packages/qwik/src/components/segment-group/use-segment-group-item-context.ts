import type { ItemState } from '@zag-js/radio-group'
import { useStore } from '@qwik.dev/core'
import { createContext } from '../../utils/create-context.ts'

/**
 * Item-level context: a second store context, keyed the same way as the main
 * `SegmentGroupApiStore` (R2), carrying the per-item `ItemState` snapshot
 * (`checked`/`focused`/`hovered`/`active`/...). `ItemState` is plain
 * serializable data (no closures), so it does not need `noSerialize` — but it
 * is still wrapped in a `useStore` that is rewritten on every render of
 * `<SegmentGroup.Item>`, so consumers deep in the tree that read it during
 * their own render stay subscribed and up to date.
 */
export interface SegmentGroupItemStore {
  state: ItemState | undefined
}

export const [SegmentGroupItemProvider, useSegmentGroupItemStore] = createContext<SegmentGroupItemStore>({
  name: 'ark.segment-group-item',
  hookName: 'useSegmentGroupItemContext',
  providerName: '<SegmentGroup.Item />',
})

export interface UseSegmentGroupItemContext extends ItemState {}

export const useSegmentGroupItemContext = (): ItemState | undefined => useSegmentGroupItemStore().state

export const useSegmentGroupItemStoreValue = (state: ItemState | undefined): SegmentGroupItemStore => {
  const store = useStore<SegmentGroupItemStore>({ state })
  store.state = state
  return store
}
