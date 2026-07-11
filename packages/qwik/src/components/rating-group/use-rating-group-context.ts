import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseRatingGroupReturn } from './use-rating-group.ts'

export interface RatingGroupApiStore extends ApiStore<UseRatingGroupReturn> {}

export const [RatingGroupProvider, useRatingGroupStore] = createContext<RatingGroupApiStore>({
  name: 'ark.rating-group',
  hookName: 'useRatingGroupContext',
  providerName: '<RatingGroup.Root />',
})

export interface UseRatingGroupContext extends UseRatingGroupReturn {}

export const useRatingGroupContext = (): UseRatingGroupReturn | undefined => useRatingGroupStore().api
