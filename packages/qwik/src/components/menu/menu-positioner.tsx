import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresenceContext } from '../presence/index.ts'
import { useMenuContext } from './use-menu-context.ts'

export interface MenuPositionerBaseProps extends PolymorphicProps<'div'> {}
export interface MenuPositionerProps extends HTMLProps<'div'>, MenuPositionerBaseProps {}

export const MenuPositioner = component$<MenuPositionerProps>((props) => {
  const api = useMenuContext()
  const presence = usePresenceContext()

  if (presence?.unmounted) return null

  const positionerProps = api ? mergeProps(api.getPositionerProps(), props) : props

  return (
    <ark.div {...positionerProps}>
      <Slot />
    </ark.div>
  )
})
