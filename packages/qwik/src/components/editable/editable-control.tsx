import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useEditableContext } from './use-editable-context.ts'

export interface EditableControlBaseProps extends PolymorphicProps<'div'> {}
export interface EditableControlProps extends HTMLProps<'div'>, EditableControlBaseProps {}

export const EditableControl = component$<EditableControlProps>((props) => {
  const api = useEditableContext()
  const controlProps = api ? mergeProps(api.getControlProps(), props) : props

  return (
    <ark.div {...controlProps}>
      <Slot />
    </ark.div>
  )
})
