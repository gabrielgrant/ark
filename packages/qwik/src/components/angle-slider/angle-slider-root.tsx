import type { ValueChangeDetails } from '@zag-js/angle-slider'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { AngleSliderProvider } from './use-angle-slider-context.ts'
import { type UseAngleSliderProps, useAngleSlider } from './use-angle-slider.ts'

const machinePropKeys = [
  'aria-label',
  'aria-labelledby',
  'defaultValue',
  'disabled',
  'id',
  'ids',
  'invalid',
  'name',
  'onValueChange',
  'onValueChangeEnd',
  'readOnly',
  'step',
  'value',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onValueChange$', 'onValueChangeEnd$'])

export interface AngleSliderRootBaseProps extends UseAngleSliderProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onValueChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered, so
   * `onValueChange` only works for client-only usage.
   */
  onValueChange$?: QRL<(details: ValueChangeDetails) => void>
  /**
   * QRL variant of `onValueChangeEnd`. See `onValueChange$`.
   */
  onValueChangeEnd$?: QRL<(details: ValueChangeDetails) => void>
}
export interface AngleSliderRootProps extends Assign<HTMLProps<'div'>, AngleSliderRootBaseProps> {}

export const AngleSliderRoot = component$<AngleSliderRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useAngleSlider(() => {
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

    const plainChangeEnd = record.onValueChangeEnd as ((details: ValueChangeDetails) => void) | undefined
    const qrlChangeEnd = record.onValueChangeEnd$ as QRL<(details: ValueChangeDetails) => void> | undefined
    if (plainChangeEnd || qrlChangeEnd) {
      machineProps.onValueChangeEnd = (details: ValueChangeDetails) => {
        plainChangeEnd?.(details)
        void qrlChangeEnd?.(details)
      }
    }

    return machineProps as UseAngleSliderProps
  })

  const store = useApiStore(api)
  AngleSliderProvider(store)

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
