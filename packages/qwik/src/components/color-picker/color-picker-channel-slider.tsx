import type { ChannelProps } from '@zag-js/color-picker'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { ColorPickerChannelPropsProvider } from './use-color-picker-channel-props-context.ts'
import { useColorPickerContext } from './use-color-picker-context.ts'
import { useColorPickerFormatPropsContext } from './use-color-picker-format-context.ts'

const itemPropKeys = ['channel', 'orientation'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface ColorPickerChannelSliderBaseProps extends ChannelProps, PolymorphicProps<'div'> {}
export interface ColorPickerChannelSliderProps extends HTMLProps<'div'>, ColorPickerChannelSliderBaseProps {}

export const ColorPickerChannelSlider = component$<ColorPickerChannelSliderProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const channelProps = {} as ChannelProps
  for (const key of itemPropKeys) {
    if (key in record) (channelProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useColorPickerContext()
  const formatProps = useColorPickerFormatPropsContext()
  const channelSliderProps = { ...channelProps, ...formatProps }

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const channelSliderElProps = api ? mergeProps(api.getChannelSliderProps(channelSliderProps), rest) : rest

  ColorPickerChannelPropsProvider(channelProps)

  return (
    <ark.div {...channelSliderElProps}>
      <Slot />
    </ark.div>
  )
})
