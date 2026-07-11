import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useEditableContext } from './use-editable-context.ts'

export interface EditableSubmitTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface EditableSubmitTriggerProps extends HTMLProps<'button'>, EditableSubmitTriggerBaseProps {}

export const EditableSubmitTrigger = component$<EditableSubmitTriggerProps>((props) => {
  const api = useEditableContext()
  const triggerProps = api ? mergeProps(api.getSubmitTriggerProps(), props) : props

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
