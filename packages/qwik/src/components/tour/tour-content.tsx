import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresence } from '../presence/index.ts'
import { useRenderStrategyContext } from '../../utils/render-strategy.ts'
import { useTourContext } from './use-tour-context.ts'

export interface TourContentBaseProps extends PolymorphicProps<'div'> {}
export interface TourContentProps extends HTMLProps<'div'>, TourContentBaseProps {}

export const TourContent = component$<TourContentProps>((props) => {
  const api = useTourContext()
  const renderStrategy = useRenderStrategyContext()
  const presence = usePresence(() => ({ ...renderStrategy, present: api?.open ?? false }))

  if (presence.unmounted) return null

  const rest = props as Record<string, unknown>
  const contentProps = api
    ? mergeProps(api.getContentProps(), presence.presenceProps, rest)
    : mergeProps(presence.presenceProps, rest)
  // extract to a local: a member expression in JSX position is compiled to a
  // read-only WrappedSignal, which applyRef cannot write the element into (Q31)
  const contentRef = presence.ref

  return (
    <ark.div {...contentProps} ref={contentRef}>
      <Slot />
    </ark.div>
  )
})
