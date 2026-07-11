import type { ItemProps } from '@zag-js/radio-group'
import { createContext } from '../../utils/create-context.ts'

/**
 * Internal context carrying the static `{ value, disabled, invalid }` props a
 * `<SegmentGroup.Item>` was given, so its sub-parts (ItemControl/ItemText/
 * ItemHiddenInput) can call the main api's `getItemXProps(itemProps)` without
 * needing the props threaded through manually. Not exported from the public
 * `index.ts` (mirrors solid/react).
 */
export const [SegmentGroupItemPropsProvider, useSegmentGroupItemPropsContext] = createContext<ItemProps>({
  name: 'ark.segment-group-item-props',
  hookName: 'useSegmentGroupItemPropsContext',
  providerName: '<SegmentGroup.Item />',
})
