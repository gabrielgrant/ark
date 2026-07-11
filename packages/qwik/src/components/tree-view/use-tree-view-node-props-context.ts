import type { NodeProps } from '@zag-js/tree-view'
import { createContext } from '../../utils/create-context.ts'

/**
 * Internal context carrying the static `{ node, indexPath }` a
 * `<TreeView.NodeProvider>` was given, so its descendant parts (Item/Branch and
 * their sub-parts) can call the main api's `getXProps(nodeProps)` without
 * needing the props threaded through manually. Plain serializable data (like
 * radio-group's `ItemPropsProvider`) -- no `noSerialize`/store wrapper needed.
 * Not exported from the public `index.ts` (mirrors solid/react).
 */
export const [TreeViewNodePropsProvider, useTreeViewNodePropsContext] = createContext<NodeProps>({
  name: 'ark.tree-view-node-props',
  hookName: 'useTreeViewNodePropsContext',
  providerName: '<TreeView.NodeProvider />',
})
