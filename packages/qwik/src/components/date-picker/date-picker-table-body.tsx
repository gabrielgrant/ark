import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'
import { useDatePickerTableContext } from './use-date-picker-table-props-context.ts'

export interface DatePickerTableBodyBaseProps extends PolymorphicProps<'tbody'> {}
export interface DatePickerTableBodyProps extends HTMLProps<'tbody'>, DatePickerTableBodyBaseProps {}

export const DatePickerTableBody = component$<DatePickerTableBodyProps>((props) => {
  const api = useDatePickerContext()
  const tableProps = useDatePickerTableContext()
  const tableBodyProps = api ? mergeProps(api.getTableBodyProps(tableProps), props) : props

  return (
    <ark.tbody {...tableBodyProps}>
      <Slot />
    </ark.tbody>
  )
})
