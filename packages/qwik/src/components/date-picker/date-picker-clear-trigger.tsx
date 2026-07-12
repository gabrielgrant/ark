import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'

export interface DatePickerClearTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface DatePickerClearTriggerProps extends HTMLProps<'button'>, DatePickerClearTriggerBaseProps {}

export const DatePickerClearTrigger = component$<DatePickerClearTriggerProps>((props) => {
  const api = useDatePickerContext()
  const clearTriggerProps = api ? mergeProps(api.getClearTriggerProps(), props) : props

  return (
    <ark.button {...clearTriggerProps}>
      <Slot />
    </ark.button>
  )
})
