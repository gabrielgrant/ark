import type { TriggerProps } from '@zag-js/menu'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresenceContext } from '../presence/index.ts'
import { useMenuContext } from './use-menu-context.ts'

const triggerPropKeys = ['value'] as const

const ownKeySet = new Set<string>(triggerPropKeys)

export interface MenuTriggerBaseProps extends TriggerProps, PolymorphicProps<'button'> {}
export interface MenuTriggerProps extends Assign<HTMLProps<'button'>, MenuTriggerBaseProps> {}

export const MenuTrigger = component$<MenuTriggerProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const triggerProps: TriggerProps = {}
  for (const key of triggerPropKeys) {
    if (key in record) (triggerProps as Record<string, unknown>)[key] = record[key]
  }

  const api = useMenuContext()
  const presence = usePresenceContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }
  if (presence?.unmounted) rest['aria-controls'] = null

  const triggerButtonProps = api ? mergeProps(api.getTriggerProps(triggerProps), rest) : rest

  return (
    <ark.button {...triggerButtonProps}>
      <Slot />
    </ark.button>
  )
})
