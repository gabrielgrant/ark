import { component$ } from '@qwik.dev/core'
import { TreeView, createTreeCollection } from '../index.ts'
import { useTreeViewNodeContext } from '../use-tree-view-node-context.ts'

interface Node {
  id: string
  name: string
  children?: Node[]
}

const collection = createTreeCollection<Node>({
  nodeToValue: (node) => node.id,
  nodeToString: (node) => node.name,
  rootNode: {
    id: 'ROOT',
    name: '',
    children: [
      {
        id: 'node_modules',
        name: 'node_modules',
        children: [
          { id: 'node_modules/zag-js', name: 'zag-js' },
          { id: 'node_modules/panda', name: 'panda' },
        ],
      },
      {
        id: 'src',
        name: 'src',
        children: [{ id: 'src/index.ts', name: 'index.ts' }],
      },
      { id: 'package.json', name: 'package.json' },
    ],
  },
})

interface TreeNodeProps {
  node: Node
  indexPath: number[]
}

const TreeNodeRenderer = component$<TreeNodeProps>((props) => {
  const nodeState = useTreeViewNodeContext()

  if (props.node.children) {
    return (
      <TreeView.Branch data-testid={`branch-${props.node.id}`}>
        <TreeView.BranchControl data-testid={`branch-control-${props.node.id}`}>
          <TreeView.BranchTrigger data-testid={`branch-trigger-${props.node.id}`}>
            <TreeView.BranchIndicator data-testid={`branch-indicator-${props.node.id}`}>{'>'}</TreeView.BranchIndicator>
            <TreeView.BranchText data-testid={`branch-text-${props.node.id}`}>
              {nodeState?.expanded ? 'open' : 'closed'}: {props.node.name}
            </TreeView.BranchText>
          </TreeView.BranchTrigger>
        </TreeView.BranchControl>
        <TreeView.BranchContent data-testid={`branch-content-${props.node.id}`}>
          <TreeView.BranchIndentGuide data-testid={`branch-indent-guide-${props.node.id}`} />
          {props.node.children.map((child, index) => (
            <TreeNode key={child.id} node={child} indexPath={[...props.indexPath, index]} />
          ))}
        </TreeView.BranchContent>
      </TreeView.Branch>
    )
  }

  return (
    <TreeView.Item data-testid={`item-${props.node.id}`}>
      <TreeView.ItemText data-testid={`item-text-${props.node.id}`}>{props.node.name}</TreeView.ItemText>
      <TreeView.ItemIndicator data-testid={`item-indicator-${props.node.id}`}>{'✓'}</TreeView.ItemIndicator>
    </TreeView.Item>
  )
})

const TreeNode = component$<TreeNodeProps>((props) => {
  return (
    <TreeView.NodeProvider node={props.node} indexPath={props.indexPath}>
      <TreeNodeRenderer node={props.node} indexPath={props.indexPath} />
    </TreeView.NodeProvider>
  )
})

export const ComponentUnderTest = (props: Omit<TreeView.RootProps<Node>, 'collection'>) => (
  <TreeView.Root collection={collection} {...props}>
    <TreeView.Label data-testid="label">Tree</TreeView.Label>
    <TreeView.Tree data-testid="tree">
      {collection.rootNode.children?.map((node, index) => (
        <TreeNode key={node.id} node={node} indexPath={[index]} />
      ))}
    </TreeView.Tree>
  </TreeView.Root>
)
