import type { ValueChangeDetails } from '@zag-js/radio-group'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { parts } from './segment-group.anatomy.ts'
import { SegmentGroupProvider } from './use-segment-group-context.ts'
import { type UseSegmentGroupProps, useSegmentGroup } from './use-segment-group.ts'

const machinePropKeys = [
  'defaultValue',
  'disabled',
  'form',
  'id',
  'ids',
  'invalid',
  'name',
  'onValueChange',
  'orientation',
  'readOnly',
  'required',
  'value',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onValueChange$'])

export interface SegmentGroupRootBaseProps extends UseSegmentGroupProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onValueChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onValueChange$?: QRL<(details: ValueChangeDetails) => void>
}
export interface SegmentGroupRootProps extends Assign<HTMLProps<'div'>, SegmentGroupRootBaseProps> {}

export const SegmentGroupRoot = component$<SegmentGroupRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useSegmentGroup(() => {
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
    return machineProps as UseSegmentGroupProps
  })

  const store = useApiStore(api)
  SegmentGroupProvider(store)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const rootProps = mergeProps(api.getRootProps(), parts.root.attrs as Record<string, string>, rest)

  return (
    <ark.div {...rootProps}>
      <Slot />
    </ark.div>
  )
})
