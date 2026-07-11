import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useNavigationMenuContext } from './use-navigation-menu-context.ts'

export interface NavigationMenuListBaseProps extends PolymorphicProps<'div'> {}
export interface NavigationMenuListProps extends HTMLProps<'div'>, NavigationMenuListBaseProps {}

export const NavigationMenuList = component$<NavigationMenuListProps>((props) => {
  const api = useNavigationMenuContext()
  const listProps = api ? mergeProps(api.getListProps(), props) : props

  return (
    <ark.div {...listProps}>
      <Slot />
    </ark.div>
  )
})
