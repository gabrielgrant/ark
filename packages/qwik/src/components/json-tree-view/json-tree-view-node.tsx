import { type JsonNode, getAccessibleDescription, jsonNodeToElement, keyPathToKey } from '@zag-js/json-tree-utils'
import { component$ } from '@qwik.dev/core'
import { TreeView, useTreeViewContext } from '../tree-view/index.ts'
import { useJsonTreeViewPropsContext } from './json-tree-view-props-context.ts'
import { JsonTreeViewKeyNode } from './json-tree-view-key-node.tsx'
import { JsonTreeViewValueNode } from './json-tree-view-value-node.tsx'

export interface JsonTreeViewNodeBaseProps {
  /**
   * Whether to render the built-in indent guide for branch nodes.
   *
   * Solid/react also accept a custom icon/element for this (and for an
   * `arrow`/`renderValue` prop); this Qwik port only offers the boolean
   * form -- see `JsonTreeViewValueNode`'s doc comment for why a custom
   * render callback is deferred.
   */
  indentGuide?: boolean
}

export interface JsonTreeViewNodeProps extends JsonTreeViewNodeBaseProps {
  node: JsonNode
  indexPath: number[]
}

const scopeProps = {
  'data-scope': 'json-tree-view',
}

/**
 * A real `component$` (unlike `JsonTreeViewValueNode`): it reads
 * `useTreeViewContext()`/`useJsonTreeViewPropsContext()`, and Qwik's hooks
 * must be called from a stable, once-per-instance position -- calling them
 * from a plain function invoked a data-dependent number of times within a
 * single parent's render (as recursion over an arbitrary-depth JSON tree
 * would) breaks that bookkeeping. Each recursive node therefore gets its
 * own component instance.
 */
export const JsonTreeViewNode = component$<JsonTreeViewNodeProps>((props) => {
  const tree = useTreeViewContext<JsonNode>()
  const nodeState = tree?.getNodeState({ node: props.node, indexPath: props.indexPath })
  const options = useJsonTreeViewPropsContext()

  const key = keyPathToKey(props.node.keyPath, { excludeRoot: true })
  const valueNode = jsonNodeToElement(props.node, options)

  const description = getAccessibleDescription(props.node)
  const line = props.indexPath.reduce((acc, curr) => acc + curr, 1)
  const lineLength = props.indexPath.length - 1
  const nodeProps = {
    ...scopeProps,
    'aria-label': description,
    'data-line': line,
    style: { '--line-length': lineLength },
  }

  return (
    <TreeView.NodeProvider node={props.node} indexPath={props.indexPath}>
      {nodeState?.isBranch ? (
        <TreeView.Branch {...scopeProps}>
          <TreeView.BranchControl {...nodeProps}>
            <TreeView.BranchText {...scopeProps}>
              {key ? <JsonTreeViewKeyNode node={props.node} showQuotes={options.quotesOnKeys} /> : null}
              <JsonTreeViewValueNode node={valueNode} />
            </TreeView.BranchText>
          </TreeView.BranchControl>
          <TreeView.BranchContent {...scopeProps}>
            {props.indentGuide ? <TreeView.BranchIndentGuide /> : null}
            {(props.node.children ?? []).map((child, index) => (
              <JsonTreeViewNode
                key={index}
                node={child}
                indexPath={[...props.indexPath, index]}
                indentGuide={props.indentGuide}
              />
            ))}
          </TreeView.BranchContent>
        </TreeView.Branch>
      ) : (
        <TreeView.Item {...nodeProps}>
          <TreeView.ItemText {...scopeProps}>
            {key ? <JsonTreeViewKeyNode node={props.node} showQuotes={options.quotesOnKeys} /> : null}
            <JsonTreeViewValueNode node={valueNode} />
          </TreeView.ItemText>
        </TreeView.Item>
      )}
    </TreeView.NodeProvider>
  )
})
