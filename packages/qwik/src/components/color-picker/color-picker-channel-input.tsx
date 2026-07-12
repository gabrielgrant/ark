import type { ChannelInputProps } from '@zag-js/color-picker'
import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useColorPickerContext } from './use-color-picker-context.ts'

const itemPropKeys = ['channel', 'orientation'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface ColorPickerChannelInputBaseProps extends ChannelInputProps, PolymorphicProps<'input'> {}
export interface ColorPickerChannelInputProps extends HTMLProps<'input'>, ColorPickerChannelInputBaseProps {}

export const ColorPickerChannelInput = component$<ColorPickerChannelInputProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const channelProps = {} as ChannelInputProps
  for (const key of itemPropKeys) {
    if (key in record) (channelProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useColorPickerContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const inputProps = api ? mergeProps(api.getChannelInputProps(channelProps), rest) : rest

  return <ark.input {...inputProps} />
})
