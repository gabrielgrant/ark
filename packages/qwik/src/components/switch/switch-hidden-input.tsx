import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldContext } from '../field/use-field-context.ts'
import { useSwitchContext } from './use-switch-context.ts'

export interface SwitchHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface SwitchHiddenInputProps extends HTMLProps<'input'>, SwitchHiddenInputBaseProps {}

export const SwitchHiddenInput = component$<SwitchHiddenInputProps>((props) => {
  const api = useSwitchContext()
  const field = useFieldContext()
  const describedBy: Record<string, any> = field?.ariaDescribedby ? { 'aria-describedby': field.ariaDescribedby } : {}
  const inputProps = api
    ? mergeProps(api.getHiddenInputProps(), describedBy, props as Record<string, any>)
    : props

  return <ark.input {...inputProps} />
})
