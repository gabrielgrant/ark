import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { TreeNode } from '../collection.ts'
import type { UseCascadeSelectReturn } from './use-cascade-select.ts'

export interface CascadeSelectApiStore extends ApiStore<UseCascadeSelectReturn<TreeNode>> {}

export const [CascadeSelectProvider, useCascadeSelectStore] = createContext<CascadeSelectApiStore>({
  name: 'ark.cascade-select',
  hookName: 'useCascadeSelectContext',
  providerName: '<CascadeSelect.Root />',
})

export interface UseCascadeSelectContext<T extends TreeNode = TreeNode> extends UseCascadeSelectReturn<T> {}

export const useCascadeSelectContext = <T extends TreeNode = TreeNode>(): UseCascadeSelectReturn<T> | undefined =>
  useCascadeSelectStore().api as UseCascadeSelectReturn<T> | undefined
