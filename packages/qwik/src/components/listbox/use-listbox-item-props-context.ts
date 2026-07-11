import type { ItemProps } from '@zag-js/listbox'
import { createContext } from '../../utils/create-context.ts'

/**
 * Internal context carrying the static `{ item, highlightOnHover }` props a
 * `<Listbox.Item>` was given, so its sub-parts (ItemText/ItemIndicator) can
 * call the main api's `getItemXProps(itemProps)` without needing the props
 * threaded through manually. Not exported from the public `index.ts` (mirrors
 * solid/react).
 */
export const [ListboxItemPropsProvider, useListboxItemPropsContext] = createContext<ItemProps>({
  name: 'ark.listbox-item-props',
  hookName: 'useListboxItemPropsContext',
  providerName: '<Listbox.Item />',
})
