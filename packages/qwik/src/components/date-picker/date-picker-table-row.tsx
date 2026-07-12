import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'
import { useDatePickerTableContext } from './use-date-picker-table-props-context.ts'

export interface DatePickerTableRowBaseProps extends PolymorphicProps<'tr'> {}
export interface DatePickerTableRowProps extends HTMLProps<'tr'>, DatePickerTableRowBaseProps {}

export const DatePickerTableRow = component$<DatePickerTableRowProps>((props) => {
  const api = useDatePickerContext()
  const tableProps = useDatePickerTableContext()
  const tableRowProps = api ? mergeProps(api.getTableRowProps(tableProps), props) : props

  return (
    <ark.tr {...tableRowProps}>
      <Slot />
    </ark.tr>
  )
})
