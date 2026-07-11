import type { ItemProps } from '@zag-js/radio-group'
import { createContext } from '../../utils/create-context.ts'

/**
 * Internal context carrying the static `{ value, disabled, invalid }` props a
 * `<RadioGroup.Item>` was given, so its sub-parts (ItemControl/ItemText/
 * ItemHiddenInput) can call the main api's `getItemXProps(itemProps)` without
 * needing the props threaded through manually. Not exported from the public
 * `index.ts` (mirrors solid/react).
 */
export const [RadioGroupItemPropsProvider, useRadioGroupItemPropsContext] = createContext<ItemProps>({
  name: 'ark.radio-group-item-props',
  hookName: 'useRadioGroupItemPropsContext',
  providerName: '<RadioGroup.Item />',
})
