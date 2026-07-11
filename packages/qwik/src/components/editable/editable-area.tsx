import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useEditableContext } from './use-editable-context.ts'

export interface EditableAreaBaseProps extends PolymorphicProps<'div'> {}
export interface EditableAreaProps extends HTMLProps<'div'>, EditableAreaBaseProps {}

export const EditableArea = component$<EditableAreaProps>((props) => {
  const api = useEditableContext()
  const areaProps = api ? mergeProps(api.getAreaProps(), props) : props

  return (
    <ark.div {...areaProps}>
      <Slot />
    </ark.div>
  )
})
