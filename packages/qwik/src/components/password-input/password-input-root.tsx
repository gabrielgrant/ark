import { mergeProps } from '@zag-js/qwik'
import type { VisibilityChangeDetails } from '@zag-js/password-input'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { PasswordInputProvider } from './use-password-input-context.ts'
import { type UsePasswordInputProps, usePasswordInput } from './use-password-input.ts'

const machinePropKeys = [
  'autoComplete',
  'defaultVisible',
  'disabled',
  'id',
  'ids',
  'ignorePasswordManagers',
  'invalid',
  'name',
  'readOnly',
  'required',
  'translations',
  'visible',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onVisibilityChange$'])

export interface PasswordInputRootBaseProps extends UsePasswordInputProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onVisibilityChange`. Prefer this in Qwik apps: plain
   * function props cannot be serialized when the component is server-rendered.
   */
  onVisibilityChange$?: QRL<(details: VisibilityChangeDetails) => void>
}
export interface PasswordInputRootProps extends Assign<HTMLProps<'div'>, PasswordInputRootBaseProps> {}

export const PasswordInputRoot = component$<PasswordInputRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = usePasswordInput(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainVisibility = record.onVisibilityChange as ((details: VisibilityChangeDetails) => void) | undefined
    const qrlVisibility = record.onVisibilityChange$ as QRL<(details: VisibilityChangeDetails) => void> | undefined
    if (plainVisibility || qrlVisibility) {
      machineProps.onVisibilityChange = (details: VisibilityChangeDetails) => {
        plainVisibility?.(details)
        void qrlVisibility?.(details)
      }
    }

    return machineProps as UsePasswordInputProps
  })

  const store = useApiStore(api)
  PasswordInputProvider(store)

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
