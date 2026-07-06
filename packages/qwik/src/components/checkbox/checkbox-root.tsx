import type { CheckedChangeDetails } from '@zag-js/checkbox'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { CheckboxProvider } from './use-checkbox-context.ts'
import { type UseCheckboxProps, useCheckbox } from './use-checkbox.ts'

const machinePropKeys = [
  'checked',
  'defaultChecked',
  'disabled',
  'form',
  'id',
  'ids',
  'invalid',
  'name',
  'onCheckedChange',
  'readOnly',
  'required',
  'value',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onCheckedChange$'])

export interface CheckboxRootBaseProps extends UseCheckboxProps, PolymorphicProps<'label'> {
  /**
   * QRL variant of `onCheckedChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered, so
   * `onCheckedChange` only works for client-only usage.
   */
  onCheckedChange$?: QRL<(details: CheckedChangeDetails) => void>
}
export interface CheckboxRootProps extends Assign<HTMLProps<'label'>, CheckboxRootBaseProps> {}

export const CheckboxRoot = component$<CheckboxRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useCheckbox(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }
    const plain = record.onCheckedChange as ((details: CheckedChangeDetails) => void) | undefined
    const qrl = record.onCheckedChange$ as QRL<(details: CheckedChangeDetails) => void> | undefined
    if (plain || qrl) {
      machineProps.onCheckedChange = (details: CheckedChangeDetails) => {
        plain?.(details)
        void qrl?.(details)
      }
    }
    return machineProps as UseCheckboxProps
  })

  const store = useApiStore(api)
  CheckboxProvider(store)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const rootProps = mergeProps(api.getRootProps(), rest)

  return (
    <ark.label {...rootProps}>
      <Slot />
    </ark.label>
  )
})
