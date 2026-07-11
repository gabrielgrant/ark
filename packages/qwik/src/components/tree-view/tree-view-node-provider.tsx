import type { NodeProps } from '@zag-js/tree-view'
import { type JSXOutput, Slot, component$ } from '@qwik.dev/core'
import type { TreeNode } from '../collection.ts'
import { useTreeViewContext } from './use-tree-view-context.ts'
import { TreeViewNodeStateProvider, useTreeViewNodeStoreValue } from './use-tree-view-node-context.ts'
import { TreeViewNodePropsProvider } from './use-tree-view-node-props-context.ts'

export interface TreeViewNodeProviderBaseProps<T> extends NodeProps {
  node: T
}
export interface TreeViewNodeProviderProps<T> extends TreeViewNodeProviderBaseProps<T> {}

const nodePropKeys = ['node', 'indexPath'] as const

/**
 * `component$` is not itself generic-callable; the underlying implementation
 * is written as a generic function and cast through `unknown` here (mirrors
 * `SelectRoot`'s cast to `SelectRootComponent`) so call sites keep the
 * per-`T` node typing.
 */
export const TreeViewNodeProvider = component$(<T extends TreeNode>(props: TreeViewNodeProviderProps<T>) => {
  const record = props as unknown as Record<string, unknown>

  const nodeProps = {} as NodeProps
  for (const key of nodePropKeys) {
    if (key in record) (nodeProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useTreeViewContext()
  const nodeState = api?.getNodeState(nodeProps)

  TreeViewNodePropsProvider(nodeProps)
  TreeViewNodeStateProvider(useTreeViewNodeStoreValue(nodeState))

  return <Slot />
}) as unknown as TreeViewNodeProviderComponent

export type TreeViewNodeProviderComponent = <T extends TreeNode>(props: TreeViewNodeProviderProps<T>) => JSXOutput
