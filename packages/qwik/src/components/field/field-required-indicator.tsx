import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldContext } from './use-field-context.ts'

export interface FieldRequiredIndicatorBaseProps extends PolymorphicProps<'span'> {}
export interface FieldRequiredIndicatorProps extends HTMLProps<'span'>, FieldRequiredIndicatorBaseProps {}

export const FieldRequiredIndicator = component$<FieldRequiredIndicatorProps>((props) => {
  const api = useFieldContext()

  if (!api?.required) return null

  const indicatorProps = mergeProps(api.getRequiredIndicatorProps(), props)

  return (
    <ark.span {...indicatorProps}>
      <Slot>*</Slot>
    </ark.span>
  )
})
