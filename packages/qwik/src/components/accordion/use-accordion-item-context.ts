import type { ItemState } from '@zag-js/accordion'
import { useStore } from '@qwik.dev/core'
import { createContext } from '../../utils/create-context.ts'

/**
 * Item-level context: a second store context, keyed the same way as the main
 * `AccordionApiStore` (R2), carrying the per-item `ItemState` snapshot
 * (`expanded`/`focused`/`disabled`). `ItemState` is plain serializable data
 * (no closures), so it does not need `noSerialize` — but it is still wrapped
 * in a `useStore` that is rewritten on every render of `<Accordion.Item>`, so
 * consumers deep in the tree that read it during their own render stay
 * subscribed and up to date.
 */
export interface AccordionItemStore {
  state: ItemState | undefined
}

export const [AccordionItemProvider, useAccordionItemStore] = createContext<AccordionItemStore>({
  name: 'ark.accordion-item',
  hookName: 'useAccordionItemContext',
  providerName: '<Accordion.Item />',
})

export interface UseAccordionItemContext extends ItemState {}

export const useAccordionItemContext = (): ItemState | undefined => useAccordionItemStore().state

export const useAccordionItemStoreValue = (state: ItemState | undefined): AccordionItemStore => {
  const store = useStore<AccordionItemStore>({ state })
  store.state = state
  return store
}
