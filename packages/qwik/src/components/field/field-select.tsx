import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldContext } from './use-field-context.ts'

export interface FieldSelectBaseProps extends PolymorphicProps<'select'> {}
export interface FieldSelectProps extends HTMLProps<'select'>, FieldSelectBaseProps {}

export const FieldSelect = component$<FieldSelectProps>((props) => {
  const api = useFieldContext()
  const selectProps = api ? mergeProps(api.getSelectProps(), props as Record<string, unknown>) : props

  return (
    <ark.select {...selectProps}>
      <Slot />
    </ark.select>
  )
})
