import type { ColorFormat } from '@zag-js/color-picker'
import { createContext } from '../../utils/create-context.ts'

export interface UseColorPickerFormatPropsContext {
  format: ColorFormat
}

export const [ColorPickerFormatPropsProvider, useColorPickerFormatPropsContext] =
  createContext<UseColorPickerFormatPropsContext>({
    name: 'ark.color-picker.format-props',
    hookName: 'useColorPickerFormatPropsContext',
    providerName: '<ColorPicker.View />',
    strict: false,
  })
