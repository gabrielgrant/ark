import type { AreaProps } from '@zag-js/color-picker'
import { createContext } from '../../utils/create-context.ts'

export interface UseColorPickerAreaContext extends AreaProps {}

export const [ColorPickerAreaPropsProvider, useColorPickerAreaPropsContext] = createContext<UseColorPickerAreaContext>({
  name: 'ark.color-picker.area-props',
  hookName: 'useColorPickerAreaContext',
  providerName: '<ColorPicker.Area />',
  strict: true,
})
