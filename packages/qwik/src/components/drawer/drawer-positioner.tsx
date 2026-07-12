import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresenceContext } from '../presence/index.ts'
import { useDrawerContext } from './use-drawer-context.ts'

export interface DrawerPositionerBaseProps extends PolymorphicProps<'div'> {}
export interface DrawerPositionerProps extends HTMLProps<'div'>, DrawerPositionerBaseProps {}

export const DrawerPositioner = component$<DrawerPositionerProps>((props) => {
  const api = useDrawerContext()
  const presence = usePresenceContext()

  if (presence?.unmounted) return null

  const positionerProps = api ? mergeProps(api.getPositionerProps(), props) : props

  return (
    <ark.div {...positionerProps}>
      <Slot />
    </ark.div>
  )
})
