import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldContext } from '../field/use-field-context.ts'
import { useEditableContext } from './use-editable-context.ts'

export interface EditableInputBaseProps extends PolymorphicProps<'input'> {}
export interface EditableInputProps extends HTMLProps<'input'>, EditableInputBaseProps {}

export const EditableInput = component$<EditableInputProps>((props) => {
  const api = useEditableContext()
  const field = useFieldContext()
  const describedBy: Record<string, any> = field?.ariaDescribedby ? { 'aria-describedby': field.ariaDescribedby } : {}
  const inputProps = api ? mergeProps(api.getInputProps(), describedBy, props as Record<string, any>) : props

  return <ark.input {...inputProps} />
})
