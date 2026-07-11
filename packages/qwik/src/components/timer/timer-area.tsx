import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTimerContext } from './use-timer-context.ts'

export interface TimerAreaBaseProps extends PolymorphicProps<'div'> {}
export interface TimerAreaProps extends HTMLProps<'div'>, TimerAreaBaseProps {}

export const TimerArea = component$<TimerAreaProps>((props) => {
  const api = useTimerContext()
  const areaProps = api ? mergeProps(api.getAreaProps(), props) : props

  return (
    <ark.div {...areaProps}>
      <Slot />
    </ark.div>
  )
})
