import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'

/**
 * `valueText` is NOT a declared part in this checkout's `@zag-js/date-picker`
 * anatomy (`date-picker.anatomy.ts` lists 24 parts, no `valueText`) even
 * though the React/Solid ports reference `datePickerAnatomy.build().valueText`
 * -- that only type-checks there against a different (likely newer, published)
 * `@zag-js/anatomy` version. `AnatomyPart.build()` is strictly typed to the
 * declared part-name union (see `create-anatomy.ts`), so referencing a
 * missing key is a real `tsc` error here, not a false positive. Since PLAN.md
 * forbids editing the zag checkout, the attrs are reproduced by hand instead
 * of going through the (incomplete) anatomy object -- `toKebabCase("valueText")`
 * is `"value-text"`, matching what `anatomy.build()` would have produced.
 */
const valueTextAttrs = { 'data-scope': 'date-picker', 'data-part': 'value-text' } as const

export interface DatePickerValueTextBaseProps extends PolymorphicProps<'span'> {
  /**
   * Text to display when no date is selected.
   */
  placeholder?: string | undefined
  /**
   * The separator to use between multiple date values when using default rendering.
   * @default ", "
   */
  separator?: string | undefined
}

export interface DatePickerValueTextProps extends Assign<HTMLProps<'span'>, DatePickerValueTextBaseProps> {}

/**
 * Other frameworks accept a `children` render-prop to customize rendering of
 * each selected date (`(props: { value, index, valueAsString, remove }) =>
 * JSX.Element`). Qwik has no children-as-function idiom (R6), so only the
 * default join-by-separator rendering is supported here; the render-prop
 * customization mode is a documented API-parity gap.
 */
export const DatePickerValueText = component$<DatePickerValueTextProps>((props) => {
  const api = useDatePickerContext()
  const { placeholder, separator, ...rest } = props

  const hasValue = api ? api.value.length > 0 : false
  const text = hasValue ? api?.valueAsString.join(separator ?? ', ') : placeholder

  return (
    <ark.span {...valueTextAttrs} {...rest}>
      {text}
      <Slot />
    </ark.span>
  )
})
