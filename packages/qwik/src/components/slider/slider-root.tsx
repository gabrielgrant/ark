import type { FocusChangeDetails, ValueChangeDetails } from '@zag-js/slider'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { SliderProvider } from './use-slider-context.ts'
import { type UseSliderProps, useSlider } from './use-slider.ts'

const machinePropKeys = [
  'aria-label',
  'aria-labelledby',
  'defaultValue',
  'disabled',
  'form',
  'getAriaValueText',
  'id',
  'ids',
  'invalid',
  'max',
  'min',
  'minStepsBetweenThumbs',
  'name',
  'onFocusChange',
  'onValueChange',
  'onValueChangeEnd',
  'orientation',
  'origin',
  'readOnly',
  'step',
  'thumbAlignment',
  'thumbCollisionBehavior',
  'thumbSize',
  'value',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onFocusChange$', 'onValueChange$', 'onValueChangeEnd$'])

export interface SliderRootBaseProps extends UseSliderProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onFocusChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered, so
   * `onFocusChange` only works for client-only usage.
   */
  onFocusChange$?: QRL<(details: FocusChangeDetails) => void>
  /**
   * QRL variant of `onValueChange`. See `onFocusChange$`.
   */
  onValueChange$?: QRL<(details: ValueChangeDetails) => void>
  /**
   * QRL variant of `onValueChangeEnd`. See `onFocusChange$`.
   */
  onValueChangeEnd$?: QRL<(details: ValueChangeDetails) => void>
  /**
   * `getAriaValueText` stays plain-function-only (R12): the machine consumes
   * its return value synchronously to build `aria-valuetext`, which a QRL
   * (async invocation) cannot provide.
   */
}
export interface SliderRootProps extends Assign<HTMLProps<'div'>, SliderRootBaseProps> {}

export const SliderRoot = component$<SliderRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useSlider(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainFocus = record.onFocusChange as ((details: FocusChangeDetails) => void) | undefined
    const qrlFocus = record.onFocusChange$ as QRL<(details: FocusChangeDetails) => void> | undefined
    if (plainFocus || qrlFocus) {
      machineProps.onFocusChange = (details: FocusChangeDetails) => {
        plainFocus?.(details)
        void qrlFocus?.(details)
      }
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

    return machineProps as UseSliderProps
  })

  const store = useApiStore(api)
  SliderProvider(store)

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
