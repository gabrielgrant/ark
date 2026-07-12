import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFileUploadContext } from './use-file-upload-context.ts'
import { useFileUploadItemPropsContext } from './use-file-upload-item-props-context.ts'

export interface FileUploadItemSizeTextBaseProps extends PolymorphicProps<'div'> {}
export interface FileUploadItemSizeTextProps extends HTMLProps<'div'>, FileUploadItemSizeTextBaseProps {}

export const FileUploadItemSizeText = component$<FileUploadItemSizeTextProps>((props) => {
  const api = useFileUploadContext()
  const itemProps = useFileUploadItemPropsContext()
  const itemSizeTextProps = api ? mergeProps(api.getItemSizeTextProps(itemProps), props) : props
  const hasChildren = props.children != null
  const fileSize = api?.getFileSize(itemProps.file)

  // rule R13: render the derived value as a sibling expression next to an
  // always-claimed Slot rather than as the Slot's fallback content.
  return (
    <ark.div {...itemSizeTextProps}>
      {hasChildren ? null : fileSize}
      <Slot />
    </ark.div>
  )
})
