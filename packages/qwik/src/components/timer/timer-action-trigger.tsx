import type { ActionTriggerProps, TimerAction } from '@zag-js/timer'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTimerContext } from './use-timer-context.ts'

const actionTriggerPropKeys = ['action'] as const

const ownKeySet = new Set<string>(actionTriggerPropKeys)

export interface TimerActionTriggerBaseProps extends ActionTriggerProps, PolymorphicProps<'button'> {}
export interface TimerActionTriggerProps extends Assign<HTMLProps<'button'>, TimerActionTriggerBaseProps> {}

export const TimerActionTrigger = component$<TimerActionTriggerProps>((props) => {
  const record = props as unknown as Record<string, unknown>
  const action = record.action as TimerAction

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const api = useTimerContext()
  const triggerProps = api ? mergeProps(api.getActionTriggerProps({ action }), rest) : rest

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
