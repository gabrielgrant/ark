import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { ToggleProvider } from './use-toggle-context.ts'
import { type UseToggleProps, useToggle } from './use-toggle.ts'

const machinePropKeys = ['pressed', 'defaultPressed', 'disabled', 'onPressedChange'] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onPressedChange$'])

export interface ToggleRootBaseProps extends UseToggleProps, PolymorphicProps<'button'> {
  /**
   * QRL variant of `onPressedChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onPressedChange$?: QRL<(pressed: boolean) => void>
}
export interface ToggleRootProps extends Assign<HTMLProps<'button'>, ToggleRootBaseProps> {}

export const ToggleRoot = component$<ToggleRootProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const api = useToggle(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }
    const plain = record.onPressedChange as ((pressed: boolean) => void) | undefined
    const qrl = record.onPressedChange$ as QRL<(pressed: boolean) => void> | undefined
    if (plain || qrl) {
      machineProps.onPressedChange = (pressed: boolean) => {
        plain?.(pressed)
        void qrl?.(pressed)
      }
    }
    return machineProps as UseToggleProps
  })

  const store = useApiStore(api)
  ToggleProvider(store)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const rootProps = mergeProps(api.getRootProps(), rest)

  return (
    <ark.button {...rootProps}>
      <Slot />
    </ark.button>
  )
})
