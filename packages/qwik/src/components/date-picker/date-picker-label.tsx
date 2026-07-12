import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'

export interface DatePickerLabelBaseProps extends PolymorphicProps<'label'> {}
export interface DatePickerLabelProps extends HTMLProps<'label'>, DatePickerLabelBaseProps {}

export const DatePickerLabel = component$<DatePickerLabelProps>((props) => {
  const api = useDatePickerContext()
  const labelProps = api ? mergeProps(api.getLabelProps(), props) : props

  return (
    <ark.label {...labelProps}>
      <Slot />
    </ark.label>
  )
})
