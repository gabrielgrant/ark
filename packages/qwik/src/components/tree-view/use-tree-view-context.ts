import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { TreeNode } from '../collection.ts'
import type { UseTreeViewReturn } from './use-tree-view.ts'

export interface TreeViewApiStore extends ApiStore<UseTreeViewReturn<TreeNode>> {}

export const [TreeViewProvider, useTreeViewStore] = createContext<TreeViewApiStore>({
  name: 'ark.tree-view',
  hookName: 'useTreeViewContext',
  providerName: '<TreeView.Root />',
})

export interface UseTreeViewContext<T extends TreeNode = TreeNode> extends UseTreeViewReturn<T> {}

export const useTreeViewContext = <T extends TreeNode = TreeNode>(): UseTreeViewReturn<T> | undefined =>
  useTreeViewStore().api as UseTreeViewReturn<T> | undefined
