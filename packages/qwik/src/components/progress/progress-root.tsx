import { mergeProps } from '@zag-js/qwik'
import type { ValueChangeDetails } from '@zag-js/progress'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { ProgressProvider } from './use-progress-context.ts'
import { type UseProgressProps, useProgress } from './use-progress.ts'

const machinePropKeys = [
  'defaultValue',
  'formatOptions',
  'id',
  'ids',
  'locale',
  'max',
  'min',
  'onValueChange',
  'orientation',
  'translations',
  'value',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onValueChange$'])

export interface ProgressRootBaseProps extends UseProgressProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onValueChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onValueChange$?: QRL<(details: ValueChangeDetails) => void>
}
export interface ProgressRootProps extends Assign<HTMLProps<'div'>, ProgressRootBaseProps> {}

export const ProgressRoot = component$<ProgressRootProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const api = useProgress(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }
    const plain = record.onValueChange as ((details: ValueChangeDetails) => void) | undefined
    const qrl = record.onValueChange$ as QRL<(details: ValueChangeDetails) => void> | undefined
    if (plain || qrl) {
      machineProps.onValueChange = (details: ValueChangeDetails) => {
        plain?.(details)
        void qrl?.(details)
      }
    }
    return machineProps as UseProgressProps
  })

  const store = useApiStore(api)
  ProgressProvider(store)

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
