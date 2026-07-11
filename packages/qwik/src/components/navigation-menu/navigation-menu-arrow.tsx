import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useNavigationMenuContext } from './use-navigation-menu-context.ts'

export interface NavigationMenuArrowBaseProps extends PolymorphicProps<'div'> {}
export interface NavigationMenuArrowProps extends HTMLProps<'div'>, NavigationMenuArrowBaseProps {}

export const NavigationMenuArrow = component$<NavigationMenuArrowProps>((props) => {
  const api = useNavigationMenuContext()
  const arrowProps = api ? mergeProps(api.getArrowProps(), props) : props

  return (
    <ark.div {...arrowProps}>
      <Slot />
    </ark.div>
  )
})
