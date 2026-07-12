import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresence } from '../presence/index.ts'
import { useRenderStrategyContext } from '../../utils/render-strategy.ts'
import { useTourContext } from './use-tour-context.ts'

export interface TourSpotlightBaseProps extends PolymorphicProps<'div'> {}
export interface TourSpotlightProps extends HTMLProps<'div'>, TourSpotlightBaseProps {}

export const TourSpotlight = component$<TourSpotlightProps>((props) => {
  const api = useTourContext()
  const renderStrategy = useRenderStrategyContext()
  const presence = usePresence(() => ({ ...renderStrategy, present: api?.open ?? false }))

  if (presence.unmounted) return null

  const rest = props as Record<string, unknown>
  // rule R17: deliver the per-step override through the mergeProps spread.
  const override = { hidden: !api?.open || !api?.step?.target?.() }
  const spotlightProps = api
    ? mergeProps(api.getSpotlightProps(), presence.presenceProps, override, rest)
    : mergeProps(presence.presenceProps, override, rest)
  const spotlightRef = presence.ref

  return <ark.div {...spotlightProps} ref={spotlightRef} />
})
