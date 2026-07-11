import type { ItemProps } from '@zag-js/select'
import { createContext } from '../../utils/create-context.ts'

/**
 * Internal context carrying the static `{ item, persistFocus }` props a
 * `<Select.Item>` was given, so its sub-parts (ItemText/ItemIndicator) can
 * call the main api's `getItemXProps(itemProps)` without needing the props
 * threaded through manually. Not exported from the public `index.ts` (mirrors
 * solid/react).
 */
export const [SelectItemPropsProvider, useSelectItemPropsContext] = createContext<ItemProps>({
  name: 'ark.select-item-props',
  hookName: 'useSelectItemPropsContext',
  providerName: '<Select.Item />',
})
