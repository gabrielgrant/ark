import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'
import { useDatePickerTableContext } from './use-date-picker-table-props-context.ts'

export interface DatePickerTableHeaderBaseProps extends PolymorphicProps<'th'> {}
export interface DatePickerTableHeaderProps extends HTMLProps<'th'>, DatePickerTableHeaderBaseProps {}

export const DatePickerTableHeader = component$<DatePickerTableHeaderProps>((props) => {
  const api = useDatePickerContext()
  const tableProps = useDatePickerTableContext()
  const tableHeaderProps = api ? mergeProps(api.getTableHeaderProps(tableProps), props) : props

  return (
    <ark.th {...tableHeaderProps}>
      <Slot />
    </ark.th>
  )
})
