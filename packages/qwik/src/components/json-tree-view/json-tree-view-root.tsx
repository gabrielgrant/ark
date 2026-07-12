import { type JsonNode, getRootNode, nodeToString, nodeToValue } from '@zag-js/json-tree-utils'
import { Slot, component$, noSerialize } from '@qwik.dev/core'
import { TreeView, createTreeCollection } from '../tree-view/index.ts'
import type { TreeViewRootProps } from '../tree-view/tree-view-root.tsx'
import { getBranchValues } from './get-branch-value.ts'
import { type JsonTreeViewOptions, JsonTreeViewPropsProvider } from './json-tree-view-props-context.ts'

/**
 * `data` is `unknown`, not just plain-JSON-safe values -- `@zag-js/json-tree-utils`
 * explicitly supports rendering non-JSON JS types (`Date`, `Map`, `Set`,
 * `RegExp`, `Error`, ...) via its `dataTypes` registry. Each resulting
 * `JsonNode.value` that is one of those class instances would otherwise
 * crash Qwik's SSR serializer (Q20) the moment a node carrying it is passed
 * as a `component$` prop (R15, same class as `File`/`Blob` in
 * `file-upload`). Tag every node's `value` once, right after the tree is
 * built, rather than re-checking at each of the many recursive
 * `<JsonTreeViewNode>` prop boundaries.
 */
function tagNonSerializableValues(node: JsonNode): void {
  if (typeof node.value === 'object' && node.value !== null) {
    noSerialize(node.value)
  }
  for (const child of node.children ?? []) {
    tagNonSerializableValues(child)
  }
}

export interface JsonTreeViewRootBaseProps extends JsonTreeViewOptions {
  /**
   * The data to display in the tree.
   */
  data: unknown
  /**
   * The default expand level.
   */
  defaultExpandedDepth?: number
}

export interface JsonTreeViewRootProps
  extends Omit<TreeViewRootProps<JsonNode>, 'collection'>, JsonTreeViewRootBaseProps {}

const jsonTreeOptionKeys = [
  'maxPreviewItems',
  'collapseStringsAfterLength',
  'quotesOnKeys',
  'groupArraysAfterLength',
  'showNonenumerable',
] as const

const ownKeySet = new Set<string>([...jsonTreeOptionKeys, 'data', 'defaultExpandedDepth'])

export const JsonTreeViewRoot = component$<JsonTreeViewRootProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const jsonTreeProps = {} as JsonTreeViewOptions
  for (const key of jsonTreeOptionKeys) {
    if (key in record) (jsonTreeProps as Record<string, unknown>)[key] = record[key]
  }

  const data = record.data
  const defaultExpandedDepth = record.defaultExpandedDepth as number | undefined

  /**
   * `TreeCollection` is a plain class instance -- constructed fresh here
   * (the `Root` that consumes it, per `collection.ts`'s rule) and handed
   * straight into `<TreeView.Root collection={...}>`, whose own
   * implementation already `noSerialize()`-tags whatever it receives as
   * `collection` (see `tree-view-root.tsx`) -- no need to tag it again here.
   */
  const rootNode = getRootNode(data)
  tagNonSerializableValues(rootNode)

  const collection = createTreeCollection<JsonNode>({
    nodeToValue,
    nodeToString,
    rootNode,
  })

  const defaultExpandedValue =
    defaultExpandedDepth != null ? getBranchValues(collection, defaultExpandedDepth) : undefined

  JsonTreeViewPropsProvider(jsonTreeProps)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  return (
    <TreeView.Root
      data-scope="json-tree-view"
      collection={collection}
      defaultExpandedValue={defaultExpandedValue}
      {...(rest as unknown as Omit<TreeViewRootProps<JsonNode>, 'collection'>)}
    >
      <Slot />
    </TreeView.Root>
  )
})
