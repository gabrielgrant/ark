import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTimerContext } from './use-timer-context.ts'

export interface TimerSeparatorBaseProps extends PolymorphicProps<'div'> {}
export interface TimerSeparatorProps extends HTMLProps<'div'>, TimerSeparatorBaseProps {}

export const TimerSeparator = component$<TimerSeparatorProps>((props) => {
  const api = useTimerContext()
  const separatorProps = api ? mergeProps(api.getSeparatorProps(), props) : props

  return (
    <ark.div {...separatorProps}>
      <Slot />
    </ark.div>
  )
})
