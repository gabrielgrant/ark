import type { OpenChangeDetails } from '@zag-js/collapsible'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { CollapsibleProvider } from './use-collapsible-context.ts'
import { type UseCollapsibleProps, useCollapsible } from './use-collapsible.ts'

const machinePropKeys = [
  'collapsedHeight',
  'collapsedWidth',
  'defaultOpen',
  'disabled',
  'id',
  'ids',
  'lazyMount',
  'onExitComplete',
  'onOpenChange',
  'open',
  'unmountOnExit',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onOpenChange$', 'onExitComplete$'])

export interface CollapsibleRootBaseProps extends UseCollapsibleProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onOpenChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onOpenChange$?: QRL<(details: OpenChangeDetails) => void>
  /** QRL variant of `onExitComplete`. */
  onExitComplete$?: QRL<() => void>
}
export interface CollapsibleRootProps extends Assign<HTMLProps<'div'>, CollapsibleRootBaseProps> {}

export const CollapsibleRoot = component$<CollapsibleRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useCollapsible(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }
    const plain = record.onOpenChange as ((details: OpenChangeDetails) => void) | undefined
    const qrl = record.onOpenChange$ as QRL<(details: OpenChangeDetails) => void> | undefined
    if (plain || qrl) {
      machineProps.onOpenChange = (details: OpenChangeDetails) => {
        plain?.(details)
        void qrl?.(details)
      }
    }
    const plainExit = record.onExitComplete as (() => void) | undefined
    const qrlExit = record.onExitComplete$ as QRL<() => void> | undefined
    if (plainExit || qrlExit) {
      machineProps.onExitComplete = () => {
        plainExit?.()
        void qrlExit?.()
      }
    }
    return machineProps as UseCollapsibleProps
  })

  const store = useApiStore(api)
  CollapsibleProvider(store)

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
