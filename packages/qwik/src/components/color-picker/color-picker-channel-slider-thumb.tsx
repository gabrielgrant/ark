import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useColorPickerChannelPropsContext } from './use-color-picker-channel-props-context.ts'
import { useColorPickerContext } from './use-color-picker-context.ts'
import { useColorPickerFormatPropsContext } from './use-color-picker-format-context.ts'

export interface ColorPickerChannelSliderThumbBaseProps extends PolymorphicProps<'div'> {}
export interface ColorPickerChannelSliderThumbProps extends HTMLProps<'div'>, ColorPickerChannelSliderThumbBaseProps {}

export const ColorPickerChannelSliderThumb = component$<ColorPickerChannelSliderThumbProps>((props) => {
  const api = useColorPickerContext()
  const formatProps = useColorPickerFormatPropsContext()
  const channelProps = useColorPickerChannelPropsContext()
  const channelSliderProps = { ...channelProps, ...formatProps }

  const thumbProps = api ? mergeProps(api.getChannelSliderThumbProps(channelSliderProps), props) : props

  return (
    <ark.div {...thumbProps}>
      <Slot />
    </ark.div>
  )
})
