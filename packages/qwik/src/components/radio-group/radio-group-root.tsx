import { mergeProps } from '@zag-js/qwik'
import type { ValueChangeDetails } from '@zag-js/radio-group'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { RadioGroupProvider } from './use-radio-group-context.ts'
import { type UseRadioGroupProps, useRadioGroup } from './use-radio-group.ts'

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

export interface RadioGroupRootBaseProps extends UseRadioGroupProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onValueChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onValueChange$?: QRL<(details: ValueChangeDetails) => void>
}
export interface RadioGroupRootProps extends Assign<HTMLProps<'div'>, RadioGroupRootBaseProps> {}

export const RadioGroupRoot = component$<RadioGroupRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useRadioGroup(() => {
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
    return machineProps as UseRadioGroupProps
  })

  const store = useApiStore(api)
  RadioGroupProvider(store)

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
