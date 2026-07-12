import { mergeProps } from '@zag-js/qwik'
import { uniq } from '@zag-js/utils'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'

// Defaults to `<span>`, not `<div>` (R11): `RangeText` is typically composed
// inside `<DatePicker.ViewTrigger>`, which renders a `<button>` -- a `<div>`
// child there fails Qwik's strict SSR content-model check (Q12).
export interface DatePickerRangeTextBaseProps extends PolymorphicProps<'span'> {}
export interface DatePickerRangeTextProps extends HTMLProps<'span'>, DatePickerRangeTextBaseProps {}

export const DatePickerRangeText = component$<DatePickerRangeTextProps>((props) => {
  const api = useDatePickerContext()
  const rangeTextProps = api ? mergeProps(api.getRangeTextProps(), props) : props

  // Derived from the noSerialize api store -- render as a sibling next to an
  // always-claimed empty `<Slot/>`, never as its fallback (R13).
  const visibleRangeText = api
    ? uniq([api.visibleRangeText.start, api.visibleRangeText.end])
        .filter(Boolean)
        .join(' - ')
    : ''

  return (
    <ark.span {...rangeTextProps}>
      {visibleRangeText}
      <Slot />
    </ark.span>
  )
})
