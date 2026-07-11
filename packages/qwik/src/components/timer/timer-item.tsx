import type { ItemProps, TimePart } from '@zag-js/timer'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTimerContext } from './use-timer-context.ts'

const itemPropKeys = ['type'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface TimerItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface TimerItemProps extends Assign<HTMLProps<'div'>, TimerItemBaseProps> {}

export const TimerItem = component$<TimerItemProps>((props) => {
  const record = props as unknown as Record<string, unknown>
  const type = record.type as TimePart

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const api = useTimerContext()
  const itemProps = api ? mergeProps(api.getItemProps({ type }), rest) : rest

  // rule R13: render the derived value as a sibling expression next to an
  // always-claimed empty Slot, not as a Slot fallback (which goes stale — the
  // value reads a noSerialize store, see PLAN.md).
  return (
    <ark.div {...itemProps}>
      {api?.formattedTime[type]}
      <Slot />
    </ark.div>
  )
})
