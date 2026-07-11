import type { CopyStatusDetails, ValueChangeDetails } from '@zag-js/clipboard'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { ClipboardProvider } from './use-clipboard-context.ts'
import { type UseClipboardProps, useClipboard } from './use-clipboard.ts'

const machinePropKeys = [
  'defaultValue',
  'id',
  'ids',
  'onStatusChange',
  'onValueChange',
  'timeout',
  'translations',
  'value',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onStatusChange$', 'onValueChange$'])

export interface ClipboardRootBaseProps extends UseClipboardProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onStatusChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onStatusChange$?: QRL<(details: CopyStatusDetails) => void>
  /**
   * QRL variant of `onValueChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onValueChange$?: QRL<(details: ValueChangeDetails) => void>
}
export interface ClipboardRootProps extends Assign<HTMLProps<'div'>, ClipboardRootBaseProps> {}

export const ClipboardRoot = component$<ClipboardRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useClipboard(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainStatus = record.onStatusChange as ((details: CopyStatusDetails) => void) | undefined
    const qrlStatus = record.onStatusChange$ as QRL<(details: CopyStatusDetails) => void> | undefined
    if (plainStatus || qrlStatus) {
      machineProps.onStatusChange = (details: CopyStatusDetails) => {
        plainStatus?.(details)
        void qrlStatus?.(details)
      }
    }

    const plainValue = record.onValueChange as ((details: ValueChangeDetails) => void) | undefined
    const qrlValue = record.onValueChange$ as QRL<(details: ValueChangeDetails) => void> | undefined
    if (plainValue || qrlValue) {
      machineProps.onValueChange = (details: ValueChangeDetails) => {
        plainValue?.(details)
        void qrlValue?.(details)
      }
    }

    return machineProps as UseClipboardProps
  })

  const store = useApiStore(api)
  ClipboardProvider(store)

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
