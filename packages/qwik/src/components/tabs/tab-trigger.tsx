import type { TriggerProps } from '@zag-js/tabs'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTabsContext } from './use-tabs-context.ts'

const triggerPropKeys = ['value', 'disabled'] as const

const ownKeySet = new Set<string>(triggerPropKeys)

export interface TabTriggerBaseProps extends TriggerProps, PolymorphicProps<'button'> {}
export interface TabTriggerProps extends Assign<HTMLProps<'button'>, TabTriggerBaseProps> {}

export const TabTrigger = component$<TabTriggerProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const triggerProps = {} as TriggerProps
  for (const key of triggerPropKeys) {
    if (key in record) (triggerProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useTabsContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const buttonProps = api ? mergeProps(api.getTriggerProps(triggerProps), rest) : rest

  return (
    <ark.button {...buttonProps}>
      <Slot />
    </ark.button>
  )
})
