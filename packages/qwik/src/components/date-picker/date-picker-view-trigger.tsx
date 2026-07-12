import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'
import { useDatePickerViewContext } from './use-date-picker-view-props-context.ts'

export interface DatePickerViewTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface DatePickerViewTriggerProps extends HTMLProps<'button'>, DatePickerViewTriggerBaseProps {}

export const DatePickerViewTrigger = component$<DatePickerViewTriggerProps>((props) => {
  const api = useDatePickerContext()
  const viewProps = useDatePickerViewContext()
  const viewTriggerProps = api ? mergeProps(api.getViewTriggerProps(viewProps), props) : props

  return (
    <ark.button {...viewTriggerProps}>
      <Slot />
    </ark.button>
  )
})
