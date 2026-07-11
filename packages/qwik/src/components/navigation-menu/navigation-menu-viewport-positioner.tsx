import type { ViewportProps } from '@zag-js/navigation-menu'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useNavigationMenuContext } from './use-navigation-menu-context.ts'
import { NavigationMenuViewportPropsProvider } from './use-navigation-menu-viewport-props-context.ts'

const viewportPropKeys = ['align'] as const

const ownKeySet = new Set<string>(viewportPropKeys)

export interface NavigationMenuViewportPositionerBaseProps extends ViewportProps, PolymorphicProps<'div'> {}
export interface NavigationMenuViewportPositionerProps
  extends Assign<HTMLProps<'div'>, NavigationMenuViewportPositionerBaseProps> {}

export const NavigationMenuViewportPositioner = component$<NavigationMenuViewportPositionerProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const viewportProps = {} as ViewportProps
  for (const key of viewportPropKeys) {
    if (key in record) (viewportProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useNavigationMenuContext()

  NavigationMenuViewportPropsProvider(viewportProps)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const positionerProps = api ? mergeProps(api.getViewportPositionerProps(viewportProps), rest) : rest

  return (
    <ark.div {...positionerProps}>
      <Slot />
    </ark.div>
  )
})
