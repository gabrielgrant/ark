import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { useRenderStrategyContext } from '../../utils/render-strategy.ts'
import { usePresence } from '../presence/index.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useNavigationMenuContext } from './use-navigation-menu-context.ts'

export interface NavigationMenuIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface NavigationMenuIndicatorProps extends HTMLProps<'div'>, NavigationMenuIndicatorBaseProps {}

export const NavigationMenuIndicator = component$<NavigationMenuIndicatorProps>((props) => {
  const api = useNavigationMenuContext()
  const renderStrategy = useRenderStrategyContext()
  const presenceApi = usePresence(() => ({
    lazyMount: renderStrategy.lazyMount,
    unmountOnExit: renderStrategy.unmountOnExit,
    present: Boolean(api?.open),
  }))

  if (presenceApi.unmounted) return null

  const rest = props as Record<string, unknown>
  const mergedProps = api
    ? mergeProps(api.getIndicatorProps(), presenceApi.presenceProps, rest)
    : mergeProps(presenceApi.presenceProps, rest)
  const indicatorRef = presenceApi.ref

  return (
    <ark.div {...mergedProps} ref={indicatorRef}>
      <Slot />
    </ark.div>
  )
})
