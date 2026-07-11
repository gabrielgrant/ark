import type { InputProps } from '@zag-js/pin-input'
import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePinInputContext } from './use-pin-input-context.ts'

const itemPropKeys = ['index'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface PinInputInputBaseProps extends InputProps, PolymorphicProps<'input'> {}
export interface PinInputInputProps extends HTMLProps<'input'>, PinInputInputBaseProps {}

export const PinInputInput = component$<PinInputInputProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const itemProps = {} as InputProps
  for (const key of itemPropKeys) {
    if (key in record) (itemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = usePinInputContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const inputProps = api ? mergeProps(api.getInputProps(itemProps), rest) : rest

  return <ark.input {...inputProps} />
})
