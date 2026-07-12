import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'

export interface DatePickerTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface DatePickerTriggerProps extends HTMLProps<'button'>, DatePickerTriggerBaseProps {}

export const DatePickerTrigger = component$<DatePickerTriggerProps>((props) => {
  const api = useDatePickerContext()
  const triggerProps = api ? mergeProps(api.getTriggerProps(), props) : props

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
