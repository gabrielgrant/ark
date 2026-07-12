import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'

export interface DatePickerYearSelectBaseProps extends PolymorphicProps<'select'> {}
export interface DatePickerYearSelectProps extends HTMLProps<'select'>, DatePickerYearSelectBaseProps {}

export const DatePickerYearSelect = component$<DatePickerYearSelectProps>((props) => {
  const api = useDatePickerContext()
  const yearSelectProps = api ? mergeProps(api.getYearSelectProps(), props) : props
  const years = api ? api.getYears() : []

  return (
    <ark.select {...yearSelectProps}>
      {years.map((year) => (
        <ark.option key={year.value} value={year.value}>
          {year.label}
        </ark.option>
      ))}
    </ark.select>
  )
})
