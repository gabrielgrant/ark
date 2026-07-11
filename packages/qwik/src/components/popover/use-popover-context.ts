import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UsePopoverReturn } from './use-popover.ts'

export interface PopoverApiStore extends ApiStore<UsePopoverReturn> {}

export const [PopoverProvider, usePopoverStore] = createContext<PopoverApiStore>({
  name: 'ark.popover',
  hookName: 'usePopoverContext',
  providerName: '<Popover.Root />',
})

export interface UsePopoverContext extends UsePopoverReturn {}

export const usePopoverContext = (): UsePopoverReturn | undefined => usePopoverStore().api
