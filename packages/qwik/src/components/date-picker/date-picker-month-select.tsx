import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'

export interface DatePickerMonthSelectBaseProps extends PolymorphicProps<'select'> {}
export interface DatePickerMonthSelectProps extends HTMLProps<'select'>, DatePickerMonthSelectBaseProps {}

export const DatePickerMonthSelect = component$<DatePickerMonthSelectProps>((props) => {
  const api = useDatePickerContext()
  const monthSelectProps = api ? mergeProps(api.getMonthSelectProps(), props) : props
  const months = api ? api.getMonths() : []

  return (
    <ark.select {...monthSelectProps}>
      {months.map((month) => (
        <ark.option key={month.value} value={month.value}>
          {month.label}
        </ark.option>
      ))}
    </ark.select>
  )
})
