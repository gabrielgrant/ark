import type { DateSegment, SegmentProps } from '@zag-js/date-input'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDateInputContext } from './use-date-input-context.ts'
import { useDateInputSegmentGroupPropsContext } from './use-date-input-segment-group-props-context.ts'

const itemPropKeys = ['segment'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface DateInputSegmentBaseProps extends PolymorphicProps<'span'>, Pick<SegmentProps, 'segment'> {}
export interface DateInputSegmentProps extends HTMLProps<'span'>, DateInputSegmentBaseProps {}

export const DateInputSegment = component$<DateInputSegmentProps>((props) => {
  const record = props as unknown as Record<string, unknown>
  const segmentProp = record.segment as DateSegment

  const segmentGroupProps = useDateInputSegmentGroupPropsContext()
  const api = useDateInputContext()

  /**
   * The segment passed in as a prop can go stale (it is usually captured once
   * from `getSegments()` by the caller, e.g. in `DateInput.SegmentContext`);
   * re-derive the current segment from the live api on every render so the
   * displayed text tracks machine updates. Recomputed per render -- no
   * memoization needed (see rule R13: never render a machine-derived value as
   * a `<Slot>` fallback, it goes stale against the noSerialize api store).
   */
  const currentSegment = api
    ? (api.getSegments(segmentGroupProps).find((s) => s.type === segmentProp.type) ?? segmentProp)
    : segmentProp

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const segmentElProps = api
    ? mergeProps(api.getSegmentProps({ segment: currentSegment, index: segmentGroupProps.index }), rest)
    : rest

  return (
    <ark.span {...segmentElProps}>
      {currentSegment.text}
      <Slot />
    </ark.span>
  )
})
