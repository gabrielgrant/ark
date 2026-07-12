import type { TriggerProps } from '@zag-js/drawer'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresenceContext } from '../presence/index.ts'
import { useDrawerContext } from './use-drawer-context.ts'

export interface DrawerTriggerBaseProps extends TriggerProps, PolymorphicProps<'button'> {}
export interface DrawerTriggerProps extends Assign<HTMLProps<'button'>, DrawerTriggerBaseProps> {}

export const DrawerTrigger = component$<DrawerTriggerProps>((props) => {
  const { value, ...localProps } = props
  const api = useDrawerContext()
  const presence = usePresenceContext()

  const rest = localProps as unknown as Record<string, unknown>
  const triggerProps = (api ? mergeProps(api.getTriggerProps({ value }), rest) : { ...rest }) as Record<
    string,
    unknown
  >
  if (presence?.unmounted) triggerProps['aria-controls'] = undefined

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
