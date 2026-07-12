import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useColorPickerChannelPropsContext } from './use-color-picker-channel-props-context.ts'
import { useColorPickerContext } from './use-color-picker-context.ts'

export interface ColorPickerChannelSliderLabelBaseProps extends PolymorphicProps<'label'> {}
export interface ColorPickerChannelSliderLabelProps
  extends HTMLProps<'label'>,
    ColorPickerChannelSliderLabelBaseProps {}

export const ColorPickerChannelSliderLabel = component$<ColorPickerChannelSliderLabelProps>((props) => {
  const api = useColorPickerContext()
  const channelProps = useColorPickerChannelPropsContext()
  const labelProps = api ? mergeProps(api.getChannelSliderLabelProps(channelProps), props) : props

  return (
    <ark.label {...labelProps}>
      <Slot />
    </ark.label>
  )
})
