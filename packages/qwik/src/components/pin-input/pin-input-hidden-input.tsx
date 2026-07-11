import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldContext } from '../field/use-field-context.ts'
import { usePinInputContext } from './use-pin-input-context.ts'

export interface PinInputHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface PinInputHiddenInputProps extends HTMLProps<'input'>, PinInputHiddenInputBaseProps {}

export const PinInputHiddenInput = component$<PinInputHiddenInputProps>((props) => {
  const api = usePinInputContext()
  const field = useFieldContext()
  const describedBy: Record<string, any> = field?.ariaDescribedby ? { 'aria-describedby': field.ariaDescribedby } : {}
  const inputProps = api
    ? mergeProps(api.getHiddenInputProps(), describedBy, props as Record<string, any>)
    : props

  return <ark.input {...inputProps} />
})
