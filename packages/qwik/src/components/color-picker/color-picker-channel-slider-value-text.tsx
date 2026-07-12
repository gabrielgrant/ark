import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { useLocaleContext } from '../../providers/locale/index.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useColorPickerChannelPropsContext } from './use-color-picker-channel-props-context.ts'
import { useColorPickerContext } from './use-color-picker-context.ts'

export interface ColorPickerChannelSliderValueTextBaseProps extends PolymorphicProps<'span'> {}
export interface ColorPickerChannelSliderValueTextProps
  extends HTMLProps<'span'>,
    ColorPickerChannelSliderValueTextBaseProps {}

export const ColorPickerChannelSliderValueText = component$<ColorPickerChannelSliderValueTextProps>((props) => {
  const api = useColorPickerContext()
  const locale = useLocaleContext()
  const channelProps = useColorPickerChannelPropsContext()
  const valueTextProps = api ? mergeProps(api.getChannelSliderValueTextProps(channelProps), props) : props

  // Derived from the noSerialize api store -- render as a sibling next to an
  // always-claimed empty `<Slot/>`, never as its fallback (R13).
  const valueText = api ? api.getChannelValueText(channelProps.channel, locale.locale) : ''

  return (
    <ark.span {...valueTextProps}>
      {valueText}
      <Slot />
    </ark.span>
  )
})
