import type { ItemProps } from '@zag-js/tags-input'
import { createContext } from '../../utils/create-context.ts'

/**
 * Internal context carrying the static `{ value, index, disabled }` props a
 * `<TagsInput.Item>` was given, so its sub-parts (ItemPreview/ItemText/
 * ItemInput/ItemDeleteTrigger) can call the main api's `getItemXProps(itemProps)`
 * without needing the props threaded through manually. Not exported from the
 * public `index.ts` (mirrors solid/react).
 */
export const [TagsInputItemPropsProvider, useTagsInputItemPropsContext] = createContext<ItemProps>({
  name: 'ark.tags-input-item-props',
  hookName: 'useTagsInputItemPropsContext',
  providerName: '<TagsInput.Item />',
})
