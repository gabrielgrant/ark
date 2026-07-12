import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'
import { useDatePickerViewContext } from './use-date-picker-view-props-context.ts'

export interface DatePickerNextTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface DatePickerNextTriggerProps extends HTMLProps<'button'>, DatePickerNextTriggerBaseProps {}

export const DatePickerNextTrigger = component$<DatePickerNextTriggerProps>((props) => {
  const api = useDatePickerContext()
  const viewProps = useDatePickerViewContext()
  const nextTriggerProps = api ? mergeProps(api.getNextTriggerProps(viewProps), props) : props

  return (
    <ark.button {...nextTriggerProps}>
      <Slot />
    </ark.button>
  )
})
