import type { InputProps } from '@zag-js/date-picker'
import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'

const itemPropKeys = ['index', 'fixOnBlur'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface DatePickerInputBaseProps extends InputProps, PolymorphicProps<'input'> {}
export interface DatePickerInputProps extends HTMLProps<'input'>, DatePickerInputBaseProps {}

export const DatePickerInput = component$<DatePickerInputProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const inputProps = {} as InputProps
  for (const key of itemPropKeys) {
    if (key in record) (inputProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useDatePickerContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const inputElProps = api ? mergeProps(api.getInputProps(inputProps), rest) : rest

  return <ark.input {...inputElProps} />
})
