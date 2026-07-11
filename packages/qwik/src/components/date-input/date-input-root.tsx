import type { FocusChangeDetails, PlaceholderChangeDetails, ValueChangeDetails } from '@zag-js/date-input'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$, noSerialize } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { DateInputProvider } from './use-date-input-context.ts'
import { type UseDateInputProps, useDateInput } from './use-date-input.ts'

const machinePropKeys = [
  'allSegments',
  'createCalendar',
  'defaultPlaceholderValue',
  'defaultValue',
  'disabled',
  'form',
  'format',
  'formatter',
  'granularity',
  'hideTimeZone',
  'hourCycle',
  'id',
  'ids',
  'invalid',
  'isDateUnavailable',
  'locale',
  'max',
  'min',
  'name',
  'onFocusChange',
  'onPlaceholderChange',
  'onValueChange',
  'placeholderValue',
  'readOnly',
  'required',
  'selectionMode',
  'shouldForceLeadingZeros',
  'timeZone',
  'translations',
  'value',
] as const

/**
 * Class-instance (`@internationalized/date` `DateValue`) props. These enter
 * `component$` as normal props, so Qwik's SSR serializer sees them and would
 * otherwise crash (Q20) trying to serialize their internal calendar/methods --
 * same category as `collection` in select/listbox (R15). `noSerialize()` tags
 * the SAME object referenced by the prop wherever it is later read from.
 * `value`/`defaultValue` are arrays of `DateValue`; each element is tagged
 * individually since `noSerialize` marks by object reference, not container.
 *
 * The machine's own internal context (which also holds `DateValue` instances,
 * e.g. `placeholderValue`) is handled separately by the `ark.date` value
 * serializer registered in `src/serializers.ts` (imported by `use-date-input.ts`)
 * -- that lets the machine's Qwik-signal-backed context survive a real
 * SSR-serialize-then-resume round trip. This `noSerialize` call only concerns
 * the props *entering* this component.
 */
const dateValuePropKeys = ['min', 'max', 'placeholderValue', 'defaultPlaceholderValue'] as const
const dateValueArrayPropKeys = ['value', 'defaultValue'] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onFocusChange$', 'onPlaceholderChange$', 'onValueChange$'])

export interface DateInputRootBaseProps extends UseDateInputProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onValueChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onValueChange$?: QRL<(details: ValueChangeDetails) => void>
  /** QRL variant of `onPlaceholderChange`. See `onValueChange$`. */
  onPlaceholderChange$?: QRL<(details: PlaceholderChangeDetails) => void>
  /** QRL variant of `onFocusChange`. See `onValueChange$`. */
  onFocusChange$?: QRL<(details: FocusChangeDetails) => void>
}
export interface DateInputRootProps extends Assign<HTMLProps<'div'>, DateInputRootBaseProps> {}

export const DateInputRoot = component$<DateInputRootProps>((props) => {
  const record = props as unknown as Record<string, unknown>

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

  const api = useDateInput(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainValue = record.onValueChange as ((details: ValueChangeDetails) => void) | undefined
    const qrlValue = record.onValueChange$ as QRL<(details: ValueChangeDetails) => void> | undefined
    if (plainValue || qrlValue) {
      machineProps.onValueChange = (details: ValueChangeDetails) => {
        plainValue?.(details)
        void qrlValue?.(details)
      }
    }

    const plainPlaceholder = record.onPlaceholderChange as ((details: PlaceholderChangeDetails) => void) | undefined
    const qrlPlaceholder = record.onPlaceholderChange$ as QRL<(details: PlaceholderChangeDetails) => void> | undefined
    if (plainPlaceholder || qrlPlaceholder) {
      machineProps.onPlaceholderChange = (details: PlaceholderChangeDetails) => {
        plainPlaceholder?.(details)
        void qrlPlaceholder?.(details)
      }
    }

    const plainFocus = record.onFocusChange as ((details: FocusChangeDetails) => void) | undefined
    const qrlFocus = record.onFocusChange$ as QRL<(details: FocusChangeDetails) => void> | undefined
    if (plainFocus || qrlFocus) {
      machineProps.onFocusChange = (details: FocusChangeDetails) => {
        plainFocus?.(details)
        void qrlFocus?.(details)
      }
    }

    return machineProps as UseDateInputProps
  })

  const store = useApiStore(api)
  DateInputProvider(store)

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
