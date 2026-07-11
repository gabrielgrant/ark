import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useMenuContext } from './use-menu-context.ts'
import { useMenuItemPropsContext } from './use-menu-item-props-context.ts'

export interface MenuItemTextBaseProps extends PolymorphicProps<'div'> {}
export interface MenuItemTextProps extends HTMLProps<'div'>, MenuItemTextBaseProps {}

export const MenuItemText = component$<MenuItemTextProps>((props) => {
  const api = useMenuContext()
  const itemProps = useMenuItemPropsContext()
  const textProps = api && itemProps ? mergeProps(api.getItemTextProps(itemProps), props) : props

  return (
    <ark.div {...textProps}>
      <Slot />
    </ark.div>
  )
})
