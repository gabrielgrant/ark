import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'
import { useDatePickerTableContext } from './use-date-picker-table-props-context.ts'

export interface DatePickerWeekNumberHeaderCellBaseProps extends PolymorphicProps<'th'> {}
export interface DatePickerWeekNumberHeaderCellProps
  extends HTMLProps<'th'>,
    DatePickerWeekNumberHeaderCellBaseProps {}

export const DatePickerWeekNumberHeaderCell = component$<DatePickerWeekNumberHeaderCellProps>((props) => {
  const api = useDatePickerContext()
  const tableProps = useDatePickerTableContext()
  const weekNumberHeaderCellProps = api ? mergeProps(api.getWeekNumberHeaderCellProps(tableProps), props) : props

  return (
    <ark.th {...weekNumberHeaderCellProps}>
      <Slot />
    </ark.th>
  )
})
