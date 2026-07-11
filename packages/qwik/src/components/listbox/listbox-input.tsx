import type { InputProps } from '@zag-js/listbox'
import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useListboxContext } from './use-listbox-context.ts'

const inputPropKeys = ['autoHighlight', 'keyboardPriority'] as const

const ownKeySet = new Set<string>(inputPropKeys)

export interface ListboxInputBaseProps extends InputProps, PolymorphicProps<'input'> {}
export interface ListboxInputProps extends HTMLProps<'input'>, ListboxInputBaseProps {}

export const ListboxInput = component$<ListboxInputProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const inputProps = {} as InputProps
  for (const key of inputPropKeys) {
    if (key in record) (inputProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useListboxContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const inputElProps = api ? mergeProps(api.getInputProps(inputProps), rest) : rest

  return <ark.input {...inputElProps} />
})
