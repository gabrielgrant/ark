import type { SegmentGroupProps } from '@zag-js/date-input'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { DateInputSegment } from './date-input-segment.tsx'
import { useDateInputContext } from './use-date-input-context.ts'
import { DateInputSegmentGroupPropsProvider } from './use-date-input-segment-group-props-context.ts'

const itemPropKeys = ['index'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface DateInputSegmentGroupBaseProps extends PolymorphicProps<'div'>, SegmentGroupProps {}
export interface DateInputSegmentGroupProps extends HTMLProps<'div'>, DateInputSegmentGroupBaseProps {}

export const DateInputSegmentGroup = component$<DateInputSegmentGroupProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const segmentGroupProps = {} as SegmentGroupProps
  for (const key of itemPropKeys) {
    if (key in record) (segmentGroupProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useDateInputContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const segmentGroupElProps = api ? mergeProps(api.getSegmentGroupProps(segmentGroupProps), rest) : rest

  DateInputSegmentGroupPropsProvider(segmentGroupProps)

  /**
   * Other frameworks enumerate segments via `DateInput.SegmentContext`
   * (children-as-function over `api.getSegments()`); Qwik omits render-prop
   * "Context" parts (R6 -- `component$` has no children-as-function idiom).
   * `getSegments()` is the *only* way to know the current segment list (it
   * depends on locale/granularity/format, computed by the machine), unlike a
   * user-supplied collection -- so `SegmentGroup` renders the segments itself
   * as a plain `for` loop, as a sibling next to an always-claimed `<Slot />`
   * (R13: never rely on a `<Slot>` fallback for a machine-derived value; this
   * renders the derived list directly instead). `DateInput.Segment` stays
   * exported for advanced manual placement.
   */
  const segments = api ? api.getSegments(segmentGroupProps) : []

  return (
    <ark.div {...segmentGroupElProps}>
      {segments.map((segment) => (
        <DateInputSegment key={segment.type} segment={segment} />
      ))}
      <Slot />
    </ark.div>
  )
})
