import { mergeProps } from '@zag-js/qwik'
import { Slot, component$, noSerialize, useStore } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { type CheckboxApiStore, CheckboxProvider } from './use-checkbox-context.ts'
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

const machineKeySet = new Set<string>(machinePropKeys)

export interface CheckboxRootBaseProps extends UseCheckboxProps, PolymorphicProps<'label'> {}
export interface CheckboxRootProps extends Assign<HTMLProps<'label'>, CheckboxRootBaseProps> {}

export const CheckboxRoot = component$<CheckboxRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useCheckbox(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }
    return machineProps as UseCheckboxProps
  })

  const store = useStore<CheckboxApiStore>({ api: noSerialize(api) })
  store.api = noSerialize(api)
  CheckboxProvider(store)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!machineKeySet.has(key)) rest[key] = record[key]
  }

  const rootProps = mergeProps(api.getRootProps(), rest)

  return (
    <ark.label {...rootProps}>
      <Slot />
    </ark.label>
  )
})
