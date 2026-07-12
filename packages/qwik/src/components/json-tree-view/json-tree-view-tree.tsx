import type { JsonNode } from '@zag-js/json-tree-utils'
import { component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { TreeView, useTreeViewContext } from '../tree-view/index.ts'
import type { TreeViewTreeProps } from '../tree-view/tree-view-tree.tsx'
import { type JsonTreeViewNodeBaseProps, JsonTreeViewNode } from './json-tree-view-node.tsx'

export interface JsonTreeViewTreeBaseProps extends JsonTreeViewNodeBaseProps {}
export interface JsonTreeViewTreeProps extends Assign<TreeViewTreeProps, JsonTreeViewTreeBaseProps> {}

const ownKeySet = new Set<string>(['indentGuide'])

export const JsonTreeViewTree = component$<JsonTreeViewTreeProps>((props) => {
  const record = props as unknown as Record<string, unknown>
  const indentGuide = record.indentGuide as boolean | undefined

  const tree = useTreeViewContext<JsonNode>()
  const children = tree?.collection.getNodeChildren(tree.collection.rootNode) ?? []

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  return (
    <TreeView.Tree data-scope="json-tree-view" {...(rest as unknown as TreeViewTreeProps)}>
      {children.map((child, index) => (
        <JsonTreeViewNode key={index} node={child} indexPath={[index]} indentGuide={indentGuide} />
      ))}
    </TreeView.Tree>
  )
})
