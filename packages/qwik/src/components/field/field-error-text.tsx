import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldContext } from './use-field-context.ts'

export interface FieldErrorTextBaseProps extends PolymorphicProps<'span'> {}
export interface FieldErrorTextProps extends HTMLProps<'span'>, FieldErrorTextBaseProps {}

export const FieldErrorText = component$<FieldErrorTextProps>((props) => {
  const api = useFieldContext()

  if (!api?.invalid) return null

  const errorTextProps = mergeProps(api.getErrorTextProps(), props)

  return (
    <ark.span {...errorTextProps}>
      <Slot />
    </ark.span>
  )
})
