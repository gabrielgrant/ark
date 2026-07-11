import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseTooltipReturn } from './use-tooltip.ts'

export interface TooltipApiStore extends ApiStore<UseTooltipReturn> {}

export const [TooltipProvider, useTooltipStore] = createContext<TooltipApiStore>({
  name: 'ark.tooltip',
  hookName: 'useTooltipContext',
  providerName: '<Tooltip.Root />',
})

export interface UseTooltipContext extends UseTooltipReturn {}

export const useTooltipContext = (): UseTooltipReturn | undefined => useTooltipStore().api
