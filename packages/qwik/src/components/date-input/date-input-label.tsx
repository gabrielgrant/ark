import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDateInputContext } from './use-date-input-context.ts'

export interface DateInputLabelBaseProps extends PolymorphicProps<'label'> {}
export interface DateInputLabelProps extends HTMLProps<'label'>, DateInputLabelBaseProps {}

export const DateInputLabel = component$<DateInputLabelProps>((props) => {
  const api = useDateInputContext()
  const labelProps = api ? mergeProps(api.getLabelProps(), props) : props

  return (
    <ark.label {...labelProps}>
      <Slot />
    </ark.label>
  )
})
