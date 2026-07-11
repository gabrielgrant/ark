import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDateInputContext } from './use-date-input-context.ts'

export interface DateInputControlBaseProps extends PolymorphicProps<'div'> {}
export interface DateInputControlProps extends HTMLProps<'div'>, DateInputControlBaseProps {}

export const DateInputControl = component$<DateInputControlProps>((props) => {
  const api = useDateInputContext()
  const controlProps = api ? mergeProps(api.getControlProps(), props) : props

  return (
    <ark.div {...controlProps}>
      <Slot />
    </ark.div>
  )
})
