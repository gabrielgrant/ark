import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useMenuContext } from './use-menu-context.ts'
import { useMenuItemGroupContext } from './use-menu-item-group-context.ts'

export interface MenuItemGroupLabelBaseProps extends PolymorphicProps<'div'> {}
export interface MenuItemGroupLabelProps extends HTMLProps<'div'>, MenuItemGroupLabelBaseProps {}

export const MenuItemGroupLabel = component$<MenuItemGroupLabelProps>((props) => {
  const api = useMenuContext()
  const itemGroupContext = useMenuItemGroupContext()
  const labelProps =
    api && itemGroupContext ? mergeProps(api.getItemGroupLabelProps({ htmlFor: itemGroupContext.id }), props) : props

  return (
    <ark.div {...labelProps}>
      <Slot />
    </ark.div>
  )
})
