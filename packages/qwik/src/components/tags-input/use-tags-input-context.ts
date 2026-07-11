import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseTagsInputReturn } from './use-tags-input.ts'

export interface TagsInputApiStore extends ApiStore<UseTagsInputReturn> {}

export const [TagsInputProvider, useTagsInputStore] = createContext<TagsInputApiStore>({
  name: 'ark.tags-input',
  hookName: 'useTagsInputContext',
  providerName: '<TagsInput.Root />',
})

export interface UseTagsInputContext extends UseTagsInputReturn {}

export const useTagsInputContext = (): UseTagsInputReturn | undefined => useTagsInputStore().api
