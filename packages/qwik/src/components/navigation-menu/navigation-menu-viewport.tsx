import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { useRenderStrategyContext } from '../../utils/render-strategy.ts'
import { usePresence } from '../presence/index.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useNavigationMenuContext } from './use-navigation-menu-context.ts'
import { useNavigationMenuViewportPropsContext } from './use-navigation-menu-viewport-props-context.ts'

export interface NavigationMenuViewportBaseProps extends PolymorphicProps<'div'> {}
export interface NavigationMenuViewportProps extends HTMLProps<'div'>, NavigationMenuViewportBaseProps {}

/**
 * Ported for API parity (matches `<NavigationMenu.ViewportPositioner>`'s
 * sibling in solid/react); Content never portals into this node over Qwik
 * (R7, see `navigation-menu-content.tsx`), so the viewport itself never
 * gains size/position from the active item's content here.
 */
export const NavigationMenuViewport = component$<NavigationMenuViewportProps>((props) => {
  const viewportPropsContext = useNavigationMenuViewportPropsContext()
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
    ? mergeProps(api.getViewportProps(viewportPropsContext), presenceApi.presenceProps, rest)
    : mergeProps(presenceApi.presenceProps, rest)
  const viewportRef = presenceApi.ref

  return (
    <ark.div {...mergedProps} ref={viewportRef}>
      <Slot />
    </ark.div>
  )
})
