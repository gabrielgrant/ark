import type { ItemProps } from '@zag-js/cascade-select'
import { createContext } from '../../utils/create-context.ts'

/**
 * Internal context carrying the static `{ item, indexPath, value }` a
 * `<CascadeSelect.ItemProvider>` was given, so its descendant parts
 * (Item/ItemText/ItemIndicator) can call the main api's `getXProps(itemProps)`
 * without needing the props threaded through manually. Plain serializable
 * data (like radio-group's `ItemPropsProvider` / tree-view's
 * `NodePropsProvider`) -- no `noSerialize`/store wrapper needed. Not exported
 * from the public `index.ts` (mirrors tree-view).
 */
export const [CascadeSelectItemPropsProvider, useCascadeSelectItemPropsContext] = createContext<ItemProps>({
  name: 'ark.cascade-select-item-props',
  hookName: 'useCascadeSelectItemPropsContext',
  providerName: '<CascadeSelect.ItemProvider />',
})
