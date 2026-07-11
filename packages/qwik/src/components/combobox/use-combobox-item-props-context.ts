import type { ItemProps } from '@zag-js/combobox'
import { createContext } from '../../utils/create-context.ts'

/**
 * Internal context carrying the static `{ item, persistFocus }` props a
 * `<Combobox.Item>` was given, so its sub-parts (ItemText/ItemIndicator) can
 * call the main api's `getItemXProps(itemProps)` without needing the props
 * threaded through manually. Not exported from the public `index.ts` (mirrors
 * solid/react).
 */
export const [ComboboxItemPropsProvider, useComboboxItemPropsContext] = createContext<ItemProps>({
  name: 'ark.combobox-item-props',
  hookName: 'useComboboxItemPropsContext',
  providerName: '<Combobox.Item />',
})
