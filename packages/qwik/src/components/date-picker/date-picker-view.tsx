import type { ViewProps } from '@zag-js/date-picker'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { datePickerAnatomy } from './date-picker.anatomy.ts'
import { useDatePickerContext } from './use-date-picker-context.ts'
import { DatePickerViewProvider } from './use-date-picker-view-props-context.ts'

const itemPropKeys = ['view'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface DatePickerViewBaseProps extends Required<ViewProps>, PolymorphicProps<'div'> {}
export interface DatePickerViewProps extends HTMLProps<'div'>, DatePickerViewBaseProps {}

export const DatePickerView = component$<DatePickerViewProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const viewProps = { view: 'day' } as Required<ViewProps>
  for (const key of itemPropKeys) {
    if (key in record) (viewProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useDatePickerContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  /**
   * Unlike the Solid/React ports (which build the attrs from the anatomy and
   * set `hidden` as an explicit JSX attribute), `hidden` MUST arrive via the
   * spread here: the Qwik optimizer compiles an explicit JSX attribute
   * expression (`hidden={api.view !== view}`) into a fine-grained attribute
   * signal that re-evaluates with the CAPTURED locals -- and `api` is a stale
   * noSerialize snapshot, so the attribute froze at its first-render value
   * even though sibling parts re-rendered with the new view (established
   * empirically with a probe component; same family as R10/R13 optimizer
   * pitfalls). Values inside a spread object are diffed on every component
   * re-render instead. `api.getViewProps()` supplies `hidden` (plus the
   * anatomy attrs and `data-view`) from the machine directly.
   */
  const viewElProps = api
    ? mergeProps(api.getViewProps(viewProps), rest)
    : mergeProps(datePickerAnatomy.build().view.attrs as Record<string, string>, rest)

  DatePickerViewProvider(viewProps)

  return (
    <ark.div {...viewElProps}>
      <Slot />
    </ark.div>
  )
})
