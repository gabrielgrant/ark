import type { NodeState } from '@zag-js/tree-view'
import { useStore } from '@qwik.dev/core'
import { createContext } from '../../utils/create-context.ts'

/**
 * Node-level context (R2 companion): `NodeState` is plain serializable data
 * (no closures), so it does not need `noSerialize` -- but it is still wrapped
 * in a `useStore` that is rewritten on every render of `<TreeView.NodeProvider>`,
 * so consumers deep in the tree that read it during their own render stay
 * subscribed and up to date as the machine's expanded/selected/checked state
 * changes.
 */
export interface TreeViewNodeStore {
  state: NodeState | undefined
}

export const [TreeViewNodeStateProvider, useTreeViewNodeStore] = createContext<TreeViewNodeStore>({
  name: 'ark.tree-view-node',
  hookName: 'useTreeViewNodeContext',
  providerName: '<TreeView.NodeProvider />',
})

export interface UseTreeViewNodeContext extends NodeState {}

export const useTreeViewNodeContext = (): NodeState | undefined => useTreeViewNodeStore().state

export const useTreeViewNodeStoreValue = (state: NodeState | undefined): TreeViewNodeStore => {
  const store = useStore<TreeViewNodeStore>({ state })
  store.state = state
  return store
}
