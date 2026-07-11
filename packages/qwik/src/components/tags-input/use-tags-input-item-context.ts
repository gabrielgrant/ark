import type { ItemState } from '@zag-js/tags-input'
import { useStore } from '@qwik.dev/core'
import { createContext } from '../../utils/create-context.ts'

/**
 * Item-level context (R2 companion): `ItemState` is plain serializable data
 * (no closures), so it does not need `noSerialize` -- but it is still wrapped
 * in a `useStore` that is rewritten on every render of `<TagsInput.Item>`, so
 * consumers deep in the tree that read it during their own render stay
 * subscribed and up to date.
 */
export interface TagsInputItemStore {
  state: ItemState | undefined
}

export const [TagsInputItemProvider, useTagsInputItemStore] = createContext<TagsInputItemStore>({
  name: 'ark.tags-input-item',
  hookName: 'useTagsInputItemContext',
  providerName: '<TagsInput.Item />',
})

export interface UseTagsInputItemContext extends ItemState {}

export const useTagsInputItemContext = (): ItemState | undefined => useTagsInputItemStore().state

export const useTagsInputItemStoreValue = (state: ItemState | undefined): TagsInputItemStore => {
  const store = useStore<TagsInputItemStore>({ state })
  store.state = state
  return store
}
