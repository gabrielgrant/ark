import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UsePaginationReturn } from './use-pagination.ts'

export interface PaginationApiStore extends ApiStore<UsePaginationReturn> {}

export const [PaginationProvider, usePaginationStore] = createContext<PaginationApiStore>({
  name: 'ark.pagination',
  hookName: 'usePaginationContext',
  providerName: '<Pagination.Root />',
})

export interface UsePaginationContext extends UsePaginationReturn {}

export const usePaginationContext = (): UsePaginationReturn | undefined => usePaginationStore().api
