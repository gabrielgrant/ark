import type { ItemGroupProps } from '@zag-js/select'
import { createContext } from '../../utils/create-context.ts'

export interface UseSelectItemGroupPropsContext extends ItemGroupProps {}

export const [SelectItemGroupPropsProvider, useSelectItemGroupPropsContext] = createContext<ItemGroupProps>({
  name: 'ark.select-item-group-props',
  hookName: 'useSelectItemGroupPropsContext',
  providerName: '<Select.ItemGroup />',
})
