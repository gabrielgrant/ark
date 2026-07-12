import type { DateValue, WeekNumberCellProps } from '@zag-js/date-picker'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'

const itemPropKeys = ['weekIndex', 'week'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface DatePickerWeekNumberCellBaseProps extends PolymorphicProps<'td'> {
  weekIndex: number
  week: DateValue[]
}
export interface DatePickerWeekNumberCellProps extends HTMLProps<'td'>, DatePickerWeekNumberCellBaseProps {}

export const DatePickerWeekNumberCell = component$<DatePickerWeekNumberCellProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const cellProps = {} as WeekNumberCellProps
  for (const key of itemPropKeys) {
    if (key in record) (cellProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useDatePickerContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const weekNumberCellProps = api ? mergeProps(api.getWeekNumberCellProps(cellProps), rest) : rest

  return (
    <ark.td {...weekNumberCellProps}>
      <Slot />
    </ark.td>
  )
})
