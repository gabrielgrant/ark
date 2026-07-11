import type { ValueChangeDetails, ValueInvalidDetails } from '@zag-js/pin-input'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { PinInputProvider } from './use-pin-input-context.ts'
import { type UsePinInputProps, usePinInput } from './use-pin-input.ts'

const machinePropKeys = [
  'autoFocus',
  'autoSubmit',
  'blurOnComplete',
  'count',
  'defaultValue',
  'disabled',
  'form',
  'id',
  'ids',
  'invalid',
  'mask',
  'name',
  'onValueChange',
  'onValueComplete',
  'onValueInvalid',
  'otp',
  'pattern',
  'placeholder',
  'readOnly',
  'required',
  'sanitizeValue',
  'selectOnFocus',
  'translations',
  'type',
  'value',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onValueChange$', 'onValueComplete$', 'onValueInvalid$'])

export interface PinInputRootBaseProps extends UsePinInputProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onValueChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered, so
   * `onValueChange` only works for client-only usage.
   */
  onValueChange$?: QRL<(details: ValueChangeDetails) => void>
  /**
   * QRL variant of `onValueComplete`. See `onValueChange$`.
   */
  onValueComplete$?: QRL<(details: ValueChangeDetails) => void>
  /**
   * QRL variant of `onValueInvalid`. See `onValueChange$`.
   */
  onValueInvalid$?: QRL<(details: ValueInvalidDetails) => void>
}
export interface PinInputRootProps extends Assign<HTMLProps<'div'>, PinInputRootBaseProps> {}

export const PinInputRoot = component$<PinInputRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = usePinInput(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainChange = record.onValueChange as ((details: ValueChangeDetails) => void) | undefined
    const qrlChange = record.onValueChange$ as QRL<(details: ValueChangeDetails) => void> | undefined
    if (plainChange || qrlChange) {
      machineProps.onValueChange = (details: ValueChangeDetails) => {
        plainChange?.(details)
        void qrlChange?.(details)
      }
    }

    const plainComplete = record.onValueComplete as ((details: ValueChangeDetails) => void) | undefined
    const qrlComplete = record.onValueComplete$ as QRL<(details: ValueChangeDetails) => void> | undefined
    if (plainComplete || qrlComplete) {
      machineProps.onValueComplete = (details: ValueChangeDetails) => {
        plainComplete?.(details)
        void qrlComplete?.(details)
      }
    }

    const plainInvalid = record.onValueInvalid as ((details: ValueInvalidDetails) => void) | undefined
    const qrlInvalid = record.onValueInvalid$ as QRL<(details: ValueInvalidDetails) => void> | undefined
    if (plainInvalid || qrlInvalid) {
      machineProps.onValueInvalid = (details: ValueInvalidDetails) => {
        plainInvalid?.(details)
        void qrlInvalid?.(details)
      }
    }

    return machineProps as UsePinInputProps
  })

  const store = useApiStore(api)
  PinInputProvider(store)

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
