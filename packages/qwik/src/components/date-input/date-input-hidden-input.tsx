import type { HiddenInputProps } from '@zag-js/date-input'
import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDateInputContext } from './use-date-input-context.ts'

const itemPropKeys = ['index', 'name'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface DateInputHiddenInputBaseProps extends PolymorphicProps<'input'>, HiddenInputProps {}
export interface DateInputHiddenInputProps extends HTMLProps<'input'>, DateInputHiddenInputBaseProps {}

export const DateInputHiddenInput = component$<DateInputHiddenInputProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const hiddenInputProps = {} as HiddenInputProps
  for (const key of itemPropKeys) {
    if (key in record) (hiddenInputProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useDateInputContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const inputProps = api ? mergeProps(api.getHiddenInputProps(hiddenInputProps), rest) : rest

  return <ark.input {...inputProps} />
})
