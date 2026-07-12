import { mergeProps } from '@zag-js/qwik'
import { Slot, component$, noSerialize } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'
import {
  DatePickerTableCellProvider,
  type UseDatePickerTableCellContext,
} from './use-date-picker-table-cell-props-context.ts'
import { useDatePickerViewContext } from './use-date-picker-view-props-context.ts'

const itemPropKeys = ['disabled', 'value', 'visibleRange', 'columns'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface DatePickerTableCellBaseProps extends UseDatePickerTableCellContext, PolymorphicProps<'td'> {}
export interface DatePickerTableCellProps extends HTMLProps<'td'>, DatePickerTableCellBaseProps {}

export const DatePickerTableCell = component$<DatePickerTableCellProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const cellProps = {} as UseDatePickerTableCellContext
  for (const key of itemPropKeys) {
    if (key in record) (cellProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useDatePickerContext()
  const viewProps = useDatePickerViewContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  let tableCellProps: Record<string, unknown> = rest
  if (api) {
    const viewMap = {
      day: api.getDayTableCellProps,
      month: api.getMonthTableCellProps,
      year: api.getYearTableCellProps,
    } as const
    const viewFn = viewMap[viewProps.view] as (props: unknown) => Record<string, unknown>
    tableCellProps = mergeProps(viewFn(cellProps), rest)
  }

  /**
   * `cellProps` is shared to `<DatePicker.TableCellTrigger>` via context (R2-
   * adjacent pattern for a plain data object, not the api). In the `day` view
   * `cellProps.value` is a `DateValue` class instance (and `visibleRange`
   * holds two more) -- Qwik's `useContextProvider` verify-serializes context
   * VALUES eagerly (unlike the machine's own bindable signals, which go
   * through the `ark.date` value-serializer registered in `src/serializers.ts`;
   * that registry is consulted only inside the zag adapter's `useBindable`,
   * not by Qwik's generic context machinery), so passing the raw instance
   * crashes SSR with Q3. `noSerialize()` (R15) tags each instance by
   * reference; same caveat as R15 -- after a genuine SSR-serialize-then-resume
   * round trip these decode as `undefined` (this component tree does not
   * cross a lazy-QRL boundary in practice, so it is rebuilt fresh on every
   * render instead).
   */
  const cellValue = cellProps.value
  if (typeof cellValue === 'object' && cellValue !== null) noSerialize(cellValue)
  if (cellProps.visibleRange) {
    if (typeof cellProps.visibleRange.start === 'object' && cellProps.visibleRange.start !== null) {
      noSerialize(cellProps.visibleRange.start)
    }
    if (typeof cellProps.visibleRange.end === 'object' && cellProps.visibleRange.end !== null) {
      noSerialize(cellProps.visibleRange.end)
    }
  }

  DatePickerTableCellProvider(cellProps)

  return (
    <ark.td {...tableCellProps}>
      <Slot />
    </ark.td>
  )
})
