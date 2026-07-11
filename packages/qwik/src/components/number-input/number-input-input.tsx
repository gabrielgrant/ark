import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldContext } from '../field/use-field-context.ts'
import { useNumberInputContext } from './use-number-input-context.ts'

export interface NumberInputInputBaseProps extends PolymorphicProps<'input'> {}
export interface NumberInputInputProps extends HTMLProps<'input'>, NumberInputInputBaseProps {}

export const NumberInputInput = component$<NumberInputInputProps>((props) => {
  const api = useNumberInputContext()
  const field = useFieldContext()
  const describedBy: Record<string, any> = field?.ariaDescribedby ? { 'aria-describedby': field.ariaDescribedby } : {}
  const inputProps = api ? mergeProps(api.getInputProps(), describedBy, props as Record<string, any>) : props

  return <ark.input {...inputProps} />
})
