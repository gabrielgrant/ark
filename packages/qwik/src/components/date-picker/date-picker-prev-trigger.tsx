import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'
import { useDatePickerViewContext } from './use-date-picker-view-props-context.ts'

export interface DatePickerPrevTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface DatePickerPrevTriggerProps extends HTMLProps<'button'>, DatePickerPrevTriggerBaseProps {}

export const DatePickerPrevTrigger = component$<DatePickerPrevTriggerProps>((props) => {
  const api = useDatePickerContext()
  const viewProps = useDatePickerViewContext()
  const prevTriggerProps = api ? mergeProps(api.getPrevTriggerProps(viewProps), props) : props

  return (
    <ark.button {...prevTriggerProps}>
      <Slot />
    </ark.button>
  )
})
