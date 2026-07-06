import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldContext } from './use-field-context.ts'

export interface FieldHelperTextBaseProps extends PolymorphicProps<'span'> {}
export interface FieldHelperTextProps extends HTMLProps<'span'>, FieldHelperTextBaseProps {}

export const FieldHelperText = component$<FieldHelperTextProps>((props) => {
  const api = useFieldContext()
  const helperTextProps = api ? mergeProps(api.getHelperTextProps(), props) : props

  return (
    <ark.span {...helperTextProps}>
      <Slot />
    </ark.span>
  )
})
