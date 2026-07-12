import { noSerialize } from '@qwik.dev/core'
import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseDatePickerReturn } from './use-date-picker.ts'

/**
 * The machine `api` is a bag of non-serializable closures, so it is shared as a
 * `noSerialize` value inside a store created by `<DatePicker.Root>` (see
 * `useApiStore`). Parts read `store.api` (subscribing) and re-render when the
 * owner recomputes it. `api` is `undefined` while the component is dormant
 * (pre-wake) on the client -- parts must guard for it. See PLAN.md, rule R2.
 */
export interface DatePickerApiStore extends ApiStore<UseDatePickerReturn> {}

export const [DatePickerProvider, useDatePickerStore] = createContext<DatePickerApiStore>({
  name: 'ark.date-picker',
  hookName: 'useDatePickerContext',
  providerName: '<DatePicker.Root />',
})

export interface UseDatePickerContext extends UseDatePickerReturn {}

const tag = (v: unknown) => {
  if (typeof v === 'object' && v !== null) noSerialize(v)
}

/**
 * Deep reads through the api store (e.g. `api.weekDays`, `api.weeks`) retain
 * the read value in Qwik's SSR serialization graph -- established empirically:
 * a part that merely read `api.weekDays.length` crashed SSR with Q20 because
 * each `WeekDay.value` is a `DateValue` class instance; `untrack()` around the
 * read did NOT prevent it, but `noSerialize()`-tagging the nested instances
 * did (they then serialize as `undefined` placeholders instead of crashing).
 * `noSerialize` marks by object reference (global WeakSet) and `connect()`
 * rebuilds these arrays with fresh instances every render, so the date-bearing
 * fields are re-tagged on every context read here -- covering all `DateValue`
 * data reachable by property access off the api (function-call results like
 * `getMonthWeeks()` are fresh, non-proxied values and don't need this).
 */
const tagDateValues = (api: UseDatePickerReturn) => {
  for (const value of api.value) tag(value)
  tag(api.focusedValue)
  for (const week of api.weeks) {
    tag(week)
    for (const day of week) tag(day)
  }
  for (const weekDay of api.weekDays) tag(weekDay.value)
  tag(api.visibleRange.start)
  tag(api.visibleRange.end)
  return api
}

export const useDatePickerContext = (): UseDatePickerReturn | undefined => {
  const api = useDatePickerStore().api
  return api ? tagDateValues(api) : undefined
}
