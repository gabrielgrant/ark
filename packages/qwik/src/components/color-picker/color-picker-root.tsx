import type { FormatChangeDetails, OpenChangeDetails, ValueChangeDetails } from '@zag-js/color-picker'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$, noSerialize, useStore } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type RenderStrategyProps, RenderStrategyProvider } from '../../utils/render-strategy.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { PresenceProvider, type UsePresenceProps, usePresence } from '../presence/index.ts'
import { ColorPickerProvider } from './use-color-picker-context.ts'
import { type UseColorPickerProps, useColorPicker } from './use-color-picker.ts'

const machinePropKeys = [
  'closeOnSelect',
  'defaultFormat',
  'defaultOpen',
  'defaultValue',
  'disabled',
  'format',
  'id',
  'ids',
  'initialFocusEl',
  'inline',
  'invalid',
  'name',
  'onFocusOutside',
  'onFormatChange',
  'onInteractOutside',
  'onOpenChange',
  'onPointerDownOutside',
  'onValueChange',
  'onValueChangeEnd',
  'open',
  'openAutoFocus',
  'positioning',
  'readOnly',
  'required',
  'value',
] as const

// NOTE (R9/R12): onFocusOutside / onInteractOutside / onPointerDownOutside are
// consumed synchronously by the machine (same-tick preventDefault) and stay
// plain-function-only -- no `$` QRL variants, CSR-only.
const presencePropKeys = ['immediate', 'onExitComplete', 'skipAnimationOnMount'] as const

/**
 * `Color` class-instance props (R15): Qwik's SSR serializer sees `component$`
 * props and would crash (Q20) on the class instances. `noSerialize()` tags the
 * SAME object referenced by the prop. Same pattern and caveats as
 * `date-input-root.tsx`/`date-picker-root.tsx`.
 */
const colorValuePropKeys = ['value', 'defaultValue'] as const

const ownKeySet = new Set<string>([
  ...machinePropKeys,
  ...presencePropKeys,
  'onFormatChange$',
  'onOpenChange$',
  'onValueChange$',
  'onValueChangeEnd$',
  'onExitComplete$',
  'lazyMount',
  'unmountOnExit',
])

export interface ColorPickerRootBaseProps extends UseColorPickerProps, UsePresenceProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onFormatChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onFormatChange$?: QRL<(details: FormatChangeDetails) => void>
  /** QRL variant of `onOpenChange`. */
  onOpenChange$?: QRL<(details: OpenChangeDetails) => void>
  /** QRL variant of `onValueChange`. */
  onValueChange$?: QRL<(details: ValueChangeDetails) => void>
  /** QRL variant of `onValueChangeEnd`. */
  onValueChangeEnd$?: QRL<(details: ValueChangeDetails) => void>
  /** QRL variant of `onExitComplete`. */
  onExitComplete$?: QRL<() => void>
}
export interface ColorPickerRootProps extends Assign<HTMLProps<'div'>, ColorPickerRootBaseProps> {}

export const ColorPickerRoot = component$<ColorPickerRootProps>((props) => {
  const record = props as Record<string, unknown>

  for (const key of colorValuePropKeys) {
    if (typeof record[key] === 'object' && record[key] !== null) noSerialize(record[key])
  }

  const api = useColorPicker(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainFormat = record.onFormatChange as ((details: FormatChangeDetails) => void) | undefined
    const qrlFormat = record.onFormatChange$ as QRL<(details: FormatChangeDetails) => void> | undefined
    if (plainFormat || qrlFormat) {
      machineProps.onFormatChange = (details: FormatChangeDetails) => {
        plainFormat?.(details)
        void qrlFormat?.(details)
      }
    }

    const plainOpen = record.onOpenChange as ((details: OpenChangeDetails) => void) | undefined
    const qrlOpen = record.onOpenChange$ as QRL<(details: OpenChangeDetails) => void> | undefined
    if (plainOpen || qrlOpen) {
      machineProps.onOpenChange = (details: OpenChangeDetails) => {
        plainOpen?.(details)
        void qrlOpen?.(details)
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

    const plainValueEnd = record.onValueChangeEnd as ((details: ValueChangeDetails) => void) | undefined
    const qrlValueEnd = record.onValueChangeEnd$ as QRL<(details: ValueChangeDetails) => void> | undefined
    if (plainValueEnd || qrlValueEnd) {
      machineProps.onValueChangeEnd = (details: ValueChangeDetails) => {
        plainValueEnd?.(details)
        void qrlValueEnd?.(details)
      }
    }

    return machineProps as UseColorPickerProps
  })

  const store = useApiStore(api)
  ColorPickerProvider(store)

  const renderStrategy = useStore<RenderStrategyProps>({})
  renderStrategy.lazyMount = record.lazyMount as boolean | undefined
  renderStrategy.unmountOnExit = record.unmountOnExit as boolean | undefined
  RenderStrategyProvider(renderStrategy)

  const presenceApi = usePresence(() => {
    const presenceProps: Record<string, unknown> = {
      lazyMount: record.lazyMount,
      unmountOnExit: record.unmountOnExit,
    }
    for (const key of presencePropKeys) {
      if (key in record) presenceProps[key] = record[key]
    }
    const plainExit = record.onExitComplete as (() => void) | undefined
    const qrlExit = record.onExitComplete$ as QRL<() => void> | undefined
    if (plainExit || qrlExit) {
      presenceProps.onExitComplete = () => {
        plainExit?.()
        void qrlExit?.()
      }
    }
    presenceProps.present = api.open
    return presenceProps as UsePresenceProps
  })

  const presenceStore = useApiStore(presenceApi)
  PresenceProvider(presenceStore)

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
