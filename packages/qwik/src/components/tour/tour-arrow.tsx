import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTourContext } from './use-tour-context.ts'

export interface TourArrowBaseProps extends PolymorphicProps<'div'> {}
export interface TourArrowProps extends HTMLProps<'div'>, TourArrowBaseProps {}

export const TourArrow = component$<TourArrowProps>((props) => {
  const api = useTourContext()

  // structural gate (not a standalone JSX attribute expression, so R17 does
  // not apply): only rendered at all when the current step opts into an
  // arrow, mirroring Solid's `<Show when={tour().step?.arrow}>`.
  if (!api?.step?.arrow) return null

  const arrowProps = mergeProps(api.getArrowProps(), props)

  return (
    <ark.div {...arrowProps}>
      <Slot />
    </ark.div>
  )
})
