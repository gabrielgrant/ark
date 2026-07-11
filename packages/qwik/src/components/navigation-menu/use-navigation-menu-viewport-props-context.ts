import type { ViewportProps } from '@zag-js/navigation-menu'
import { createContext } from '../../utils/create-context.ts'

/**
 * Internal context carrying the static `{ align }` prop a
 * `<NavigationMenu.ViewportPositioner>` was given, so `<NavigationMenu.Viewport>`
 * can call `getViewportProps(viewportProps)` without the prop being threaded
 * through manually. Plain serializable data -- no store wrapper needed. Not
 * exported from the public `index.ts` (mirrors solid/react).
 */
export const [NavigationMenuViewportPropsProvider, useNavigationMenuViewportPropsContext] =
  createContext<ViewportProps>({
    name: 'ark.navigation-menu-viewport-props',
    hookName: 'useNavigationMenuViewportPropsContext',
    providerName: '<NavigationMenu.ViewportPositioner />',
    strict: false,
  })
