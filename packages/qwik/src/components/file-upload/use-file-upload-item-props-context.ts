import type { ItemProps } from '@zag-js/file-upload'
import { createContext } from '../../utils/create-context.ts'

/**
 * Internal context carrying the `{ file, type }` props a `<FileUpload.Item>`
 * was given, so its sub-parts (ItemName/ItemSizeText/ItemPreview/
 * ItemPreviewImage/ItemDeleteTrigger) can call the main api's
 * `getItemXProps(itemProps)` without needing the props threaded through
 * manually. Not exported from the public `index.ts` (mirrors solid/react).
 *
 * `file` is a `File` class instance -- `<FileUpload.Item>` tags the SAME
 * reference with `noSerialize()` (R15) before it ever reaches this provider,
 * so the wrapper object below only ever carries an already-tagged reference
 * and needs no additional tagging itself (R18's "reachable class instance"
 * concern is satisfied at the source).
 */
export const [FileUploadItemPropsProvider, useFileUploadItemPropsContext] = createContext<ItemProps>({
  name: 'ark.file-upload-item-props',
  hookName: 'useFileUploadItemPropsContext',
  providerName: '<FileUpload.Item />',
})
