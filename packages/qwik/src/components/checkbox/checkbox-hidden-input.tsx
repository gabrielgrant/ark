import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldContext } from '../field/use-field-context.ts'
import { useCheckboxContext } from './use-checkbox-context.ts'

export interface CheckboxHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface CheckboxHiddenInputProps extends HTMLProps<'input'>, CheckboxHiddenInputBaseProps {}

export const CheckboxHiddenInput = component$<CheckboxHiddenInputProps>((props) => {
  const api = useCheckboxContext()
  const field = useFieldContext()
  const describedBy: Record<string, any> = field?.ariaDescribedby ? { 'aria-describedby': field.ariaDescribedby } : {}
  const inputProps = api
    ? mergeProps(api.getHiddenInputProps(), describedBy, props as Record<string, any>)
    : props

  return <ark.input {...inputProps} />
})
