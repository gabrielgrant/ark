import type { StatusChangeDetails } from '@zag-js/avatar'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { AvatarProvider } from './use-avatar-context.ts'
import { type UseAvatarProps, useAvatar } from './use-avatar.ts'

const machinePropKeys = ['id', 'ids', 'onStatusChange'] as const
const ownKeySet = new Set<string>([...machinePropKeys, 'onStatusChange$'])

export interface AvatarRootBaseProps extends UseAvatarProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onStatusChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onStatusChange$?: QRL<(details: StatusChangeDetails) => void>
}
export interface AvatarRootProps extends Assign<HTMLProps<'div'>, AvatarRootBaseProps> {}

export const AvatarRoot = component$<AvatarRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useAvatar(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }
    const plain = record.onStatusChange as ((details: StatusChangeDetails) => void) | undefined
    const qrl = record.onStatusChange$ as QRL<(details: StatusChangeDetails) => void> | undefined
    if (plain || qrl) {
      machineProps.onStatusChange = (details: StatusChangeDetails) => {
        plain?.(details)
        void qrl?.(details)
      }
    }
    return machineProps as UseAvatarProps
  })

  const store = useApiStore(api)
  AvatarProvider(store)

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
