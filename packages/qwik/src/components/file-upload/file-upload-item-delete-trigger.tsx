import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFileUploadContext } from './use-file-upload-context.ts'
import { useFileUploadItemPropsContext } from './use-file-upload-item-props-context.ts'

export interface FileUploadItemDeleteTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface FileUploadItemDeleteTriggerProps extends HTMLProps<'button'>, FileUploadItemDeleteTriggerBaseProps {}

export const FileUploadItemDeleteTrigger = component$<FileUploadItemDeleteTriggerProps>((props) => {
  const api = useFileUploadContext()
  const itemProps = useFileUploadItemPropsContext()
  const itemDeleteTriggerProps = api ? mergeProps(api.getItemDeleteTriggerProps(itemProps), props) : props

  return (
    <ark.button {...itemDeleteTriggerProps}>
      <Slot />
    </ark.button>
  )
})
