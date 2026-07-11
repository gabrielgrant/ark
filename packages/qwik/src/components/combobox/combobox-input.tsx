import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldContext } from '../field/use-field-context.ts'
import { useComboboxContext } from './use-combobox-context.ts'

export interface ComboboxInputBaseProps extends PolymorphicProps<'input'> {}
export interface ComboboxInputProps extends HTMLProps<'input'>, ComboboxInputBaseProps {}

export const ComboboxInput = component$<ComboboxInputProps>((props) => {
  const api = useComboboxContext()
  const field = useFieldContext()
  const describedBy: Record<string, unknown> = field?.ariaDescribedby
    ? { 'aria-describedby': field.ariaDescribedby }
    : {}
  const inputProps = api
    ? mergeProps(api.getInputProps(), describedBy, props as Record<string, unknown>)
    : mergeProps(describedBy, props as Record<string, unknown>)

  return <ark.input {...inputProps} />
})
