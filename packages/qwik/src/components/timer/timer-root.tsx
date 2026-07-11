import type { TickDetails } from '@zag-js/timer'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { TimerProvider } from './use-timer-context.ts'
import { type UseTimerProps, useTimer } from './use-timer.ts'

const machinePropKeys = [
  'autoStart',
  'countdown',
  'id',
  'ids',
  'interval',
  'onComplete',
  'onTick',
  'startMs',
  'targetMs',
  'translations',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onComplete$', 'onTick$'])

export interface TimerRootBaseProps extends UseTimerProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onComplete`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onComplete$?: QRL<() => void>
  /**
   * QRL variant of `onTick`. Prefer this in Qwik apps: plain function props
   * cannot be serialized when the component is server-rendered.
   */
  onTick$?: QRL<(details: TickDetails) => void>
}
export interface TimerRootProps extends Assign<HTMLProps<'div'>, TimerRootBaseProps> {}

export const TimerRoot = component$<TimerRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useTimer(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainComplete = record.onComplete as (() => void) | undefined
    const qrlComplete = record.onComplete$ as QRL<() => void> | undefined
    if (plainComplete || qrlComplete) {
      machineProps.onComplete = () => {
        plainComplete?.()
        void qrlComplete?.()
      }
    }

    const plainTick = record.onTick as ((details: TickDetails) => void) | undefined
    const qrlTick = record.onTick$ as QRL<(details: TickDetails) => void> | undefined
    if (plainTick || qrlTick) {
      machineProps.onTick = (details: TickDetails) => {
        plainTick?.(details)
        void qrlTick?.(details)
      }
    }

    return machineProps as UseTimerProps
  })

  const store = useApiStore(api)
  TimerProvider(store)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const rootProps = mergeProps(api.getRootProps(), rest)

  return (
    <ark.div {...rootProps}>
      <Slot />
    </ark.div>
  )
})
