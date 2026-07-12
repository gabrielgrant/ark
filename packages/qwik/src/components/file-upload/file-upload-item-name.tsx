import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFileUploadContext } from './use-file-upload-context.ts'
import { useFileUploadItemPropsContext } from './use-file-upload-item-props-context.ts'

export interface FileUploadItemNameBaseProps extends PolymorphicProps<'div'> {}
export interface FileUploadItemNameProps extends HTMLProps<'div'>, FileUploadItemNameBaseProps {}

export const FileUploadItemName = component$<FileUploadItemNameProps>((props) => {
  const api = useFileUploadContext()
  const itemProps = useFileUploadItemPropsContext()
  const itemNameProps = api ? mergeProps(api.getItemNameProps(itemProps), props) : props
  const hasChildren = props.children != null

  // rule R13: render the derived value as a sibling expression next to an
  // always-claimed Slot rather than as the Slot's fallback content -- a Slot
  // fallback goes stale when it reads a noSerialize store. `hasChildren` is
  // derived from the (stable) `children` prop, not the store.
  return (
    <ark.div {...itemNameProps}>
      {hasChildren ? null : itemProps.file.name}
      <Slot />
    </ark.div>
  )
})
