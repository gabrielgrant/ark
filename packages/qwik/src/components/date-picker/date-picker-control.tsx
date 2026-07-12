import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'

export interface DatePickerControlBaseProps extends PolymorphicProps<'div'> {}
export interface DatePickerControlProps extends HTMLProps<'div'>, DatePickerControlBaseProps {}

export const DatePickerControl = component$<DatePickerControlProps>((props) => {
  const api = useDatePickerContext()
  const controlProps = api ? mergeProps(api.getControlProps(), props) : props

  return (
    <ark.div {...controlProps}>
      <Slot />
    </ark.div>
  )
})
