import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'
import { useDatePickerTableContext } from './use-date-picker-table-props-context.ts'

export interface DatePickerTableHeadBaseProps extends PolymorphicProps<'thead'> {}
export interface DatePickerTableHeadProps extends HTMLProps<'thead'>, DatePickerTableHeadBaseProps {}

export const DatePickerTableHead = component$<DatePickerTableHeadProps>((props) => {
  const api = useDatePickerContext()
  const tableProps = useDatePickerTableContext()
  const tableHeadProps = api ? mergeProps(api.getTableHeadProps(tableProps), props) : props

  return (
    <ark.thead {...tableHeadProps}>
      <Slot />
    </ark.thead>
  )
})
