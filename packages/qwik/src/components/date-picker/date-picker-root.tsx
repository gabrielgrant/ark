import type {
  FocusChangeDetails,
  OpenChangeDetails,
  ValueChangeDetails,
  ViewChangeDetails,
  VisibleRangeChangeDetails,
} from '@zag-js/date-picker'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$, noSerialize, useStore } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type RenderStrategyProps, RenderStrategyProvider } from '../../utils/render-strategy.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { PresenceProvider, type UsePresenceProps, usePresence } from '../presence/index.ts'
import { DatePickerProvider } from './use-date-picker-context.ts'
import { type UseDatePickerProps, useDatePicker } from './use-date-picker.ts'

const machinePropKeys = [
  'closeOnSelect',
  'createCalendar',
  'defaultFocusedValue',
  'defaultOpen',
  'defaultValue',
  'defaultView',
  'disabled',
  'fixedWeeks',
  'focusedValue',
  'format',
  'id',
  'ids',
  'inline',
  'invalid',
  'isDateUnavailable',
  'locale',
  'max',
  'maxSelectedDates',
  'maxView',
  'min',
  'minView',
  'name',
  'numOfMonths',
  'open',
  'openOnClick',
  'outsideDaySelectable',
  'parse',
  'placeholder',
  'positioning',
  'readOnly',
  'required',
  'selectionMode',
  'showWeekNumbers',
  'startOfWeek',
  'timeZone',
  'translations',
  'value',
  'view',
] as const

const presencePropKeys = ['immediate', 'onExitComplete', 'skipAnimationOnMount'] as const

const dateValuePropKeys = ['focusedValue', 'defaultFocusedValue', 'min', 'max'] as const
const dateValueArrayPropKeys = ['value', 'defaultValue'] as const

const ownKeySet = new Set<string>([
  ...machinePropKeys,
  ...presencePropKeys,
  'onFocusChange$',
  'onOpenChange$',
  'onValueChange$',
  'onViewChange$',
  'onVisibleRangeChange$',
  'onExitComplete$',
  'lazyMount',
  'unmountOnExit',
])

export interface DatePickerRootBaseProps extends UseDatePickerProps, UsePresenceProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onFocusChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onFocusChange$?: QRL<(details: FocusChangeDetails) => void>
  /** QRL variant of `onOpenChange`. */
  onOpenChange$?: QRL<(details: OpenChangeDetails) => void>
  /** QRL variant of `onValueChange`. */
  onValueChange$?: QRL<(details: ValueChangeDetails) => void>
  /** QRL variant of `onViewChange`. */
  onViewChange$?: QRL<(details: ViewChangeDetails) => void>
  /** QRL variant of `onVisibleRangeChange`. */
  onVisibleRangeChange$?: QRL<(details: VisibleRangeChangeDetails) => void>
  /** QRL variant of `onExitComplete`. */
  onExitComplete$?: QRL<() => void>
}
export interface DatePickerRootProps extends Assign<HTMLProps<'div'>, DatePickerRootBaseProps> {}

export const DatePickerRoot = component$<DatePickerRootProps>((props) => {
  const record = props as Record<string, unknown>

  /**
   * `DateValue` class-instance props (R15): Qwik's SSR serializer sees
   * `component$` props and would crash (Q20) on the class instances' internal
   * calendar/methods. `noSerialize()` tags the SAME object referenced by the
   * prop; array props tag each element (noSerialize marks by reference, not
   * container). Same pattern and caveats as `date-input-root.tsx`.
   */
  for (const key of dateValuePropKeys) {
    if (typeof record[key] === 'object' && record[key] !== null) noSerialize(record[key])
  }
  for (const key of dateValueArrayPropKeys) {
    const arr = record[key]
    if (Array.isArray(arr)) {
      for (const item of arr) {
        if (typeof item === 'object' && item !== null) noSerialize(item)
      }
    }
  }

  const api = useDatePicker(() => {
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

    const plainView = record.onViewChange as ((details: ViewChangeDetails) => void) | undefined
    const qrlView = record.onViewChange$ as QRL<(details: ViewChangeDetails) => void> | undefined
    if (plainView || qrlView) {
      machineProps.onViewChange = (details: ViewChangeDetails) => {
        plainView?.(details)
        void qrlView?.(details)
      }
    }

    const plainRange = record.onVisibleRangeChange as ((details: VisibleRangeChangeDetails) => void) | undefined
    const qrlRange = record.onVisibleRangeChange$ as QRL<(details: VisibleRangeChangeDetails) => void> | undefined
    if (plainRange || qrlRange) {
      machineProps.onVisibleRangeChange = (details: VisibleRangeChangeDetails) => {
        plainRange?.(details)
        void qrlRange?.(details)
      }
    }

    return machineProps as UseDatePickerProps
  })

  const store = useApiStore(api)
  DatePickerProvider(store)

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
