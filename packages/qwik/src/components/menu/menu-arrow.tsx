import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useMenuContext } from './use-menu-context.ts'

export interface MenuArrowBaseProps extends PolymorphicProps<'div'> {}
export interface MenuArrowProps extends HTMLProps<'div'>, MenuArrowBaseProps {}

export const MenuArrow = component$<MenuArrowProps>((props) => {
  const api = useMenuContext()
  const arrowProps = api ? mergeProps(api.getArrowProps(), props) : props

  return (
    <ark.div {...arrowProps}>
      <Slot />
    </ark.div>
  )
})
