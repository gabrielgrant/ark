import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldContext } from '../field/use-field-context.ts'
import { usePasswordInputContext } from './use-password-input-context.ts'

export interface PasswordInputInputBaseProps extends PolymorphicProps<'input'> {}
export interface PasswordInputInputProps extends HTMLProps<'input'>, PasswordInputInputBaseProps {}

export const PasswordInputInput = component$<PasswordInputInputProps>((props) => {
  const api = usePasswordInputContext()
  const field = useFieldContext()
  const describedBy: Record<string, unknown> = field?.ariaDescribedby
    ? { 'aria-describedby': field.ariaDescribedby }
    : {}
  const inputProps = api
    ? mergeProps(api.getInputProps(), describedBy, props as Record<string, unknown>)
    : mergeProps(describedBy, props as Record<string, unknown>)

  return <ark.input {...inputProps} />
})
