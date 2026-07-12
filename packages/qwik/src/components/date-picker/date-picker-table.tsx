import type { TableProps } from '@zag-js/date-picker'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$, useId } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'
import { DatePickerTableProvider } from './use-date-picker-table-props-context.ts'
import { useDatePickerViewContext } from './use-date-picker-view-props-context.ts'

const itemPropKeys = ['columns'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface DatePickerTableBaseProps extends Pick<TableProps, 'columns'>, PolymorphicProps<'table'> {}
export interface DatePickerTableProps extends HTMLProps<'table'>, DatePickerTableBaseProps {}

export const DatePickerTable = component$<DatePickerTableProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const columnProps = {} as Pick<TableProps, 'columns'>
  for (const key of itemPropKeys) {
    if (key in record) (columnProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useDatePickerContext()
  const viewProps = useDatePickerViewContext()
  const id = useId()
  const tableProps: TableProps = { columns: columnProps.columns, id, view: viewProps.view }

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const tableElProps = api ? mergeProps(api.getTableProps(tableProps), rest) : rest

  DatePickerTableProvider(tableProps)

  return (
    <ark.table {...tableElProps}>
      <Slot />
    </ark.table>
  )
})
