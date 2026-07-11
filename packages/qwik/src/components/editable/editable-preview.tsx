import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useEditableContext } from './use-editable-context.ts'

export interface EditablePreviewBaseProps extends PolymorphicProps<'span'> {}
export interface EditablePreviewProps extends HTMLProps<'span'>, EditablePreviewBaseProps {}

export const EditablePreview = component$<EditablePreviewProps>((props) => {
  const api = useEditableContext()
  const previewProps = api ? mergeProps(api.getPreviewProps(), props) : props

  return (
    <ark.span {...previewProps}>
      {api?.valueText}
      <Slot />
    </ark.span>
  )
})
