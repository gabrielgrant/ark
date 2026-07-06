import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldsetContext } from './use-fieldset-context.ts'

export interface FieldsetErrorTextBaseProps extends PolymorphicProps<'span'> {}
export interface FieldsetErrorTextProps extends HTMLProps<'span'>, FieldsetErrorTextBaseProps {}

export const FieldsetErrorText = component$<FieldsetErrorTextProps>((props) => {
  const api = useFieldsetContext()

  if (!api?.invalid) return null

  const errorTextProps = api ? mergeProps(api.getErrorTextProps(), props) : props

  return (
    <ark.span {...errorTextProps}>
      <Slot />
    </ark.span>
  )
})
