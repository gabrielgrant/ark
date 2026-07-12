import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresence } from '../presence/index.ts'
import { useRenderStrategyContext } from '../../utils/render-strategy.ts'
import { useTourContext } from './use-tour-context.ts'

export interface TourBackdropBaseProps extends PolymorphicProps<'div'> {}
export interface TourBackdropProps extends HTMLProps<'div'>, TourBackdropBaseProps {}

export const TourBackdrop = component$<TourBackdropProps>((props) => {
  const api = useTourContext()
  const renderStrategy = useRenderStrategyContext()
  const presence = usePresence(() => ({ ...renderStrategy, present: api?.open ?? false }))

  if (presence.unmounted) return null

  const rest = props as Record<string, unknown>
  // rule R17: a per-step `hidden` override must be delivered through the
  // mergeProps spread (a plain object merged in), never as a standalone JSX
  // attribute expression — the latter compiles to an optimizer
  // attribute-signal that freezes on the stale noSerialize api.
  const override = { hidden: !api?.step?.backdrop }
  const backdropProps = api
    ? mergeProps(api.getBackdropProps(), presence.presenceProps, override, rest)
    : mergeProps(presence.presenceProps, override, rest)
  const backdropRef = presence.ref

  return <ark.div {...backdropProps} ref={backdropRef} />
})
