import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useEditableContext } from './use-editable-context.ts'

export interface EditableCancelTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface EditableCancelTriggerProps extends HTMLProps<'button'>, EditableCancelTriggerBaseProps {}

export const EditableCancelTrigger = component$<EditableCancelTriggerProps>((props) => {
  const api = useEditableContext()
  const triggerProps = api ? mergeProps(api.getCancelTriggerProps(), props) : props

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
