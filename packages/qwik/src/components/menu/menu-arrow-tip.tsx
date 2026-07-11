import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useMenuContext } from './use-menu-context.ts'

export interface MenuArrowTipBaseProps extends PolymorphicProps<'div'> {}
export interface MenuArrowTipProps extends HTMLProps<'div'>, MenuArrowTipBaseProps {}

export const MenuArrowTip = component$<MenuArrowTipProps>((props) => {
  const api = useMenuContext()
  const arrowTipProps = api ? mergeProps(api.getArrowTipProps(), props) : props

  return (
    <ark.div {...arrowTipProps}>
      <Slot />
    </ark.div>
  )
})
