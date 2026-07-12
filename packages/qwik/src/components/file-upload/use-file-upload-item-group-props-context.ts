import type { ItemGroupProps } from '@zag-js/file-upload'
import { createContext } from '../../utils/create-context.ts'

export interface UseFileUploadItemGroupPropsContext extends ItemGroupProps {}

export const [FileUploadItemGroupPropsProvider, useFileUploadItemGroupPropsContext] =
  createContext<ItemGroupProps>({
    name: 'ark.file-upload-item-group-props',
    hookName: 'useFileUploadItemGroupPropsContext',
    providerName: '<FileUpload.ItemGroup />',
  })
