import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useMenuContext } from './use-menu-context.ts'
import { useMenuItemPropsContext } from './use-menu-item-props-context.ts'

export interface MenuItemIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface MenuItemIndicatorProps extends HTMLProps<'div'>, MenuItemIndicatorBaseProps {}

export const MenuItemIndicator = component$<MenuItemIndicatorProps>((props) => {
  const api = useMenuContext()
  const itemProps = useMenuItemPropsContext()
  const indicatorProps = api && itemProps ? mergeProps(api.getItemIndicatorProps(itemProps), props) : props

  return (
    <ark.div {...indicatorProps}>
      <Slot />
    </ark.div>
  )
})
