import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useNavigationMenuContext } from './use-navigation-menu-context.ts'
import { useNavigationMenuItemPropsContext } from './use-navigation-menu-item-props-context.ts'

export interface NavigationMenuItemIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface NavigationMenuItemIndicatorProps extends HTMLProps<'div'>, NavigationMenuItemIndicatorBaseProps {}

export const NavigationMenuItemIndicator = component$<NavigationMenuItemIndicatorProps>((props) => {
  const api = useNavigationMenuContext()
  const itemProps = useNavigationMenuItemPropsContext()
  const indicatorProps = api && itemProps ? mergeProps(api.getItemIndicatorProps(itemProps), props) : props

  return (
    <ark.div {...indicatorProps}>
      <Slot />
    </ark.div>
  )
})
