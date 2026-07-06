import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldsetContext } from './use-fieldset-context.ts'

export interface FieldsetHelperTextBaseProps extends PolymorphicProps<'span'> {}
export interface FieldsetHelperTextProps extends HTMLProps<'span'>, FieldsetHelperTextBaseProps {}

export const FieldsetHelperText = component$<FieldsetHelperTextProps>((props) => {
  const api = useFieldsetContext()
  const helperTextProps = api ? mergeProps(api.getHelperTextProps(), props) : props

  return (
    <ark.span {...helperTextProps}>
      <Slot />
    </ark.span>
  )
})
