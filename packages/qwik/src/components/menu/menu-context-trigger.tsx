import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useMenuContext } from './use-menu-context.ts'

export interface MenuContextTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface MenuContextTriggerProps extends HTMLProps<'button'>, MenuContextTriggerBaseProps {}

export const MenuContextTrigger = component$<MenuContextTriggerProps>((props) => {
  const api = useMenuContext()
  const contextTriggerProps = api ? mergeProps(api.getContextTriggerProps(), props) : props

  return (
    <ark.button {...contextTriggerProps}>
      <Slot />
    </ark.button>
  )
})
