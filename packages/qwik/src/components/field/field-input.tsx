import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldContext } from './use-field-context.ts'

export interface FieldInputBaseProps extends PolymorphicProps<'input'> {}
export interface FieldInputProps extends HTMLProps<'input'>, FieldInputBaseProps {}

export const FieldInput = component$<FieldInputProps>((props) => {
  const api = useFieldContext()
  const inputProps = api ? mergeProps(api.getInputProps(), props as Record<string, unknown>) : props

  return <ark.input {...inputProps} />
})
