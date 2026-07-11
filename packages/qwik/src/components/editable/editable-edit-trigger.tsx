import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useEditableContext } from './use-editable-context.ts'

export interface EditableEditTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface EditableEditTriggerProps extends HTMLProps<'button'>, EditableEditTriggerBaseProps {}

export const EditableEditTrigger = component$<EditableEditTriggerProps>((props) => {
  const api = useEditableContext()
  const triggerProps = api ? mergeProps(api.getEditTriggerProps(), props) : props

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
