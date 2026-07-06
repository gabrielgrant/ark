import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCheckboxContext } from './use-checkbox-context.ts'

export interface CheckboxHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface CheckboxHiddenInputProps extends HTMLProps<'input'>, CheckboxHiddenInputBaseProps {}

export const CheckboxHiddenInput = component$<CheckboxHiddenInputProps>((props) => {
  const api = useCheckboxContext()
  const inputProps = api ? mergeProps(api.getHiddenInputProps(), props) : props

  return <ark.input {...inputProps} />
})
