import type { ItemProps } from '@zag-js/file-upload'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$, noSerialize } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFileUploadContext } from './use-file-upload-context.ts'
import { useFileUploadItemGroupPropsContext } from './use-file-upload-item-group-props-context.ts'
import { FileUploadItemPropsProvider } from './use-file-upload-item-props-context.ts'

type FileUploadItemOwnProps = Omit<ItemProps, 'type'>

export interface FileUploadItemBaseProps extends FileUploadItemOwnProps, PolymorphicProps<'li'> {}
export interface FileUploadItemProps extends Assign<HTMLProps<'li'>, FileUploadItemBaseProps> {}

/**
 * `file` is a `File` class instance arriving as a plain `component$` prop --
 * Qwik would otherwise try (and fail, Q20) to serialize it as part of this
 * component's own SSR-resumable prop state. `noSerialize()` tags the SAME
 * reference (R15, same pattern as listbox's `collection`) before it is read
 * into `itemProps`/the item-props context, so every descendant part
 * (ItemName/ItemSizeText/ItemPreview/ItemPreviewImage/ItemDeleteTrigger)
 * reading it back through `useFileUploadItemPropsContext()` sees the tagged
 * reference too (R18).
 */
export const FileUploadItem = component$<FileUploadItemProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  if (typeof record.file === 'object' && record.file !== null) {
    noSerialize(record.file)
  }

  const itemGroupProps = useFileUploadItemGroupPropsContext()
  const itemProps = { file: record.file as File, type: itemGroupProps.type } as ItemProps

  const api = useFileUploadContext()

  FileUploadItemPropsProvider(itemProps)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (key !== 'file') rest[key] = record[key]
  }

  const itemLiProps = api ? mergeProps(api.getItemProps(itemProps), rest) : rest

  return (
    <ark.li {...itemLiProps}>
      <Slot />
    </ark.li>
  )
})
