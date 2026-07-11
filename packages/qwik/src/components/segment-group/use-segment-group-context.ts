import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseSegmentGroupReturn } from './use-segment-group.ts'

export interface SegmentGroupApiStore extends ApiStore<UseSegmentGroupReturn> {}

export const [SegmentGroupProvider, useSegmentGroupStore] = createContext<SegmentGroupApiStore>({
  name: 'ark.segment-group',
  hookName: 'useSegmentGroupContext',
  providerName: '<SegmentGroup.Root />',
})

export interface UseSegmentGroupContext extends UseSegmentGroupReturn {}

export const useSegmentGroupContext = (): UseSegmentGroupReturn | undefined => useSegmentGroupStore().api
