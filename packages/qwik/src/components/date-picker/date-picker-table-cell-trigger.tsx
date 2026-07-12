import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'
import { useDatePickerTableCellContext } from './use-date-picker-table-cell-props-context.ts'
import { useDatePickerViewContext } from './use-date-picker-view-props-context.ts'

export interface DatePickerTableCellTriggerBaseProps extends PolymorphicProps<'div'> {}
export interface DatePickerTableCellTriggerProps extends HTMLProps<'div'>, DatePickerTableCellTriggerBaseProps {}

export const DatePickerTableCellTrigger = component$<DatePickerTableCellTriggerProps>((props) => {
  const api = useDatePickerContext()
  const cellProps = useDatePickerTableCellContext()
  const viewProps = useDatePickerViewContext()

  let triggerProps: Record<string, unknown> = props as unknown as Record<string, unknown>
  if (api) {
    const viewMap = {
      day: api.getDayTableCellTriggerProps,
      month: api.getMonthTableCellTriggerProps,
      year: api.getYearTableCellTriggerProps,
    } as const
    const viewFn = viewMap[viewProps.view] as (props: unknown) => Record<string, unknown>
    triggerProps = mergeProps(viewFn(cellProps), props as unknown as Record<string, unknown>)
  }

  return (
    <ark.div {...triggerProps}>
      <Slot />
    </ark.div>
  )
})
