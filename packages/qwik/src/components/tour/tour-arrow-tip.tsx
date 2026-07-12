import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTourContext } from './use-tour-context.ts'

export interface TourArrowTipBaseProps extends PolymorphicProps<'div'> {}
export interface TourArrowTipProps extends HTMLProps<'div'>, TourArrowTipBaseProps {}

export const TourArrowTip = component$<TourArrowTipProps>((props) => {
  const api = useTourContext()
  const arrowTipProps = api ? mergeProps(api.getArrowTipProps(), props) : props

  return (
    <ark.div {...arrowTipProps}>
      <Slot />
    </ark.div>
  )
})
