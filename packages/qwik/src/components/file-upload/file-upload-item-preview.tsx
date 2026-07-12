import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFileUploadContext } from './use-file-upload-context.ts'
import { useFileUploadItemPropsContext } from './use-file-upload-item-props-context.ts'

export interface FileUploadItemPreviewBaseProps extends PolymorphicProps<'div'> {
  /**
   * The file type to match against. Matches all file types by default.
   * @default '.*'
   */
  type?: string
}
export interface FileUploadItemPreviewProps extends HTMLProps<'div'>, FileUploadItemPreviewBaseProps {}

export const FileUploadItemPreview = component$<FileUploadItemPreviewProps>((props) => {
  const record = props as unknown as Record<string, unknown>
  const typeMatch = (record.type as string | undefined) ?? '.*'

  const api = useFileUploadContext()
  const itemProps = useFileUploadItemPropsContext()

  if (!itemProps.file.type.match(typeMatch)) return null

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (key !== 'type') rest[key] = record[key]
  }

  const itemPreviewProps = api ? mergeProps(api.getItemPreviewProps(itemProps), rest) : rest

  return (
    <ark.div {...itemPreviewProps}>
      <Slot />
    </ark.div>
  )
})
