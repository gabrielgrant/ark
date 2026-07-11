import {
  CalendarDate,
  CalendarDateTime,
  type CalendarIdentifier,
  type DateValue,
  ZonedDateTime,
  createCalendar,
  parseDate,
  parseDateTime,
  parseZonedDateTime,
} from '@internationalized/date'
import { IncompleteDate } from '@zag-js/date-input'
import { registerValueSerializer } from '@zag-js/qwik'

/**
 * Registers the `@internationalized/date` `DateValue` classes (used by
 * date-input's and date-picker's machine context: `value`, `placeholderValue`,
 * `min`, `max`, ...) with the Zag Qwik adapter's value-serializer registry.
 *
 * Machine context lives in Qwik signals so SSR state resumes for free -- but
 * Qwik signals can only serialize plain data, and `DateValue` instances carry
 * methods/closures. Registering a serializer here lets the adapter encode the
 * value (via `.toString()`) into the signal and decode it back into the right
 * `DateValue` subclass on read, making date-input/date-picker SSR-resumable.
 *
 * This module is imported *for its side effect only* (the `registerValueSerializer`
 * call below runs at module-eval time); every module that owns a date machine
 * (`use-date-input.ts`, `use-date-picker.ts`) imports it before constructing
 * the machine. Registration is a module-level, id-keyed registry consulted by
 * every machine on the page, so importing it more than once is harmless
 * (`registerValueSerializer` replaces the existing entry for the same id).
 *
 * Decoding disambiguates the `DateValue` subclass from the shape of the
 * encoded ISO-8601-ish string (there is no discriminant on the wire besides
 * the string itself, per the id's single-string contract):
 * - contains `[` (IANA time zone suffix, e.g. `...-08:00[America/Los_Angeles]`) -> `ZonedDateTime`
 * - contains `T` (a time component, e.g. `2024-01-15T10:30:00`) -> `CalendarDateTime`
 * - otherwise (e.g. `2024-01-15`) -> `CalendarDate`
 */
registerValueSerializer({
  id: 'ark.date',
  match: (v): v is DateValue =>
    v instanceof CalendarDate || v instanceof CalendarDateTime || v instanceof ZonedDateTime,
  encode: (v) => v.toString(),
  decode: (data: string) => {
    if (data.includes('[')) return parseZonedDateTime(data)
    if (data.includes('T')) return parseDateTime(data)
    return parseDate(data)
  },
})

interface EncodedIncompleteDate {
  calendar: CalendarIdentifier
  /**
   * `IncompleteDate`'s own (string-based: `"h11" | "h12" | "h23" | "h24"`)
   * hour-cycle type is internal to the zag package (not re-exported from its
   * public entry point -- only the numeric `HourCycle` prop type is) --
   * referenced structurally via `IncompleteDate['hourCycle']` instead of by
   * importing the internal type name.
   */
  hourCycle: IncompleteDate['hourCycle']
  era: string | null
  year: number | null
  month: number | null
  day: number | null
  hour: number | null
  dayPeriod: number | null
  minute: number | null
  second: number | null
  millisecond: number | null
  offset: number | null
}

/**
 * `@zag-js/date-input`'s machine keeps a SECOND class-instance value in its
 * private context beyond `DateValue`: `displayValues` (one `IncompleteDate`
 * per date group) tracks in-progress segment editing (each field
 * independently nullable) alongside a `Calendar` instance. This is NOT a
 * `DateValue` -- `ark.date` above does not match it -- and it is present in
 * every date-input instance's default context (not just when `value`/
 * `defaultValue` props are passed), so without this second registration
 * *every* `<DateInput.Root>` crashes SSR with Q20, not just ones fed
 * `DateValue` props. Found empirically: the "renders all parts" SSR test
 * failed even with zero props.
 *
 * `Calendar` instances only expose an `identifier` (e.g. `"gregory"`); encode
 * that string and use `@internationalized/date`'s `createCalendar()` to
 * reconstruct it on decode, then rebuild the `IncompleteDate` by constructing
 * a blank instance and copying every field back (mirrors `IncompleteDate
 * .copy()` in the zag source).
 */
registerValueSerializer({
  id: 'ark.date-incomplete',
  match: (v): v is IncompleteDate => v instanceof IncompleteDate,
  encode: (v): EncodedIncompleteDate => ({
    calendar: v.calendar.identifier,
    hourCycle: v.hourCycle,
    era: v.era,
    year: v.year,
    month: v.month,
    day: v.day,
    hour: v.hour,
    dayPeriod: v.dayPeriod,
    minute: v.minute,
    second: v.second,
    millisecond: v.millisecond,
    offset: v.offset,
  }),
  decode: (data: EncodedIncompleteDate) => {
    const instance = new IncompleteDate(createCalendar(data.calendar), data.hourCycle)
    instance.era = data.era
    instance.year = data.year
    instance.month = data.month
    instance.day = data.day
    instance.hour = data.hour
    instance.dayPeriod = data.dayPeriod
    instance.minute = data.minute
    instance.second = data.second
    instance.millisecond = data.millisecond
    instance.offset = data.offset
    return instance
  },
})
