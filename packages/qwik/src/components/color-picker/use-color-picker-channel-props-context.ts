import type { ChannelProps } from '@zag-js/color-picker'
import { createContext } from '../../utils/create-context.ts'

export interface UseColorPickerChannelPropsContext extends ChannelProps {}

export const [ColorPickerChannelPropsProvider, useColorPickerChannelPropsContext] =
  createContext<UseColorPickerChannelPropsContext>({
    name: 'ark.color-picker.channel-props',
    hookName: 'useColorPickerChannelSliderContext',
    providerName: '<ColorPicker.ChannelSlider />',
    strict: true,
  })
