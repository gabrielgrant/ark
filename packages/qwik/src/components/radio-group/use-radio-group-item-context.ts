import type { ItemState } from '@zag-js/radio-group'
import { useStore } from '@qwik.dev/core'
import { createContext } from '../../utils/create-context.ts'

/**
 * Item-level context: a second store context, keyed the same way as the main
 * `RadioGroupApiStore` (R2), carrying the per-item `ItemState` snapshot
 * (`checked`/`focused`/`hovered`/`active`/...). Unlike the main api store,
 * `ItemState` is plain serializable data (no closures), so it does not need
 * `noSerialize` — but it is still wrapped in a `useStore` that is rewritten on
 * every render of `<RadioGroup.Item>`, so consumers deep in the tree that read
 * it during their own render stay subscribed and up to date.
 */
export interface RadioGroupItemStore {
  state: ItemState | undefined
}

export const [RadioGroupItemProvider, useRadioGroupItemStore] = createContext<RadioGroupItemStore>({
  name: 'ark.radio-group-item',
  hookName: 'useRadioGroupItemContext',
  providerName: '<RadioGroup.Item />',
})

export interface UseRadioGroupItemContext extends ItemState {}

export const useRadioGroupItemContext = (): ItemState | undefined => useRadioGroupItemStore().state

export const useRadioGroupItemStoreValue = (state: ItemState | undefined): RadioGroupItemStore => {
  const store = useStore<RadioGroupItemStore>({ state })
  store.state = state
  return store
}
