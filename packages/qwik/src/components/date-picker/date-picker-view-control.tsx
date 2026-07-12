import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'
import { useDatePickerViewContext } from './use-date-picker-view-props-context.ts'

export interface DatePickerViewControlBaseProps extends PolymorphicProps<'div'> {}
export interface DatePickerViewControlProps extends HTMLProps<'div'>, DatePickerViewControlBaseProps {}

export const DatePickerViewControl = component$<DatePickerViewControlProps>((props) => {
  const api = useDatePickerContext()
  const viewProps = useDatePickerViewContext()
  const viewControlProps = api ? mergeProps(api.getViewControlProps(viewProps), props) : props

  return (
    <ark.div {...viewControlProps}>
      <Slot />
    </ark.div>
  )
})
