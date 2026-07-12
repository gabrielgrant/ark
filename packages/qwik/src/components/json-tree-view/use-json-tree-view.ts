import type * as treeView from '@zag-js/tree-view'
import type { PropTypes } from '@zag-js/qwik'
import { type JsonNode, getRootNode, nodeToString, nodeToValue } from '@zag-js/json-tree-utils'
import { noSerialize } from '@qwik.dev/core'
import { createTreeCollection } from '../collection.ts'
import { type UseTreeViewProps, useTreeView } from '../tree-view/index.ts'
import { getBranchValues } from './get-branch-value.ts'
import type { JsonTreeViewOptions } from './json-tree-view-props-context.ts'

export interface UseJsonTreeViewProps extends Omit<UseTreeViewProps<JsonNode>, 'collection'>, JsonTreeViewOptions {
  data: unknown
  defaultExpandedDepth?: number
}

export interface UseJsonTreeViewReturn extends treeView.Api<PropTypes, JsonNode> {
  options: JsonTreeViewOptions
}

const jsonTreeOptionKeys = [
  'maxPreviewItems',
  'collapseStringsAfterLength',
  'quotesOnKeys',
  'groupArraysAfterLength',
  'showNonenumerable',
] as const

function tagNonSerializableValues(node: JsonNode): void {
  if (typeof node.value === 'object' && node.value !== null) {
    noSerialize(node.value)
  }
  for (const child of node.children ?? []) {
    tagNonSerializableValues(child)
  }
}

/**
 * `props` is a getter (R4 convention), re-read at the machine's event
 * boundary for `data`/`defaultExpandedDepth`/tree-view props. The `.options`
 * field exposed on the returned api is snapshotted once per call (matching
 * the granularity `<JsonTreeView.Root>` itself uses via
 * `JsonTreeViewPropsProvider`) -- this hook is the escape hatch for
 * consumers building a fully custom tree, not the `Root`'s own internal
 * wiring (`json-tree-view-root.tsx` does not call it).
 */
export const useJsonTreeView = (props: () => UseJsonTreeViewProps): UseJsonTreeViewReturn => {
  const jsonTreeProps = {} as JsonTreeViewOptions
  const current = props() as unknown as Record<string, unknown>
  for (const key of jsonTreeOptionKeys) {
    if (key in current) (jsonTreeProps as Record<string, unknown>)[key] = current[key]
  }

  const api = useTreeView<JsonNode>(() => {
    const record = props() as unknown as Record<string, unknown>

    const data = record.data
    const defaultExpandedDepth = record.defaultExpandedDepth as number | undefined

    const rootNode = getRootNode(data)
    tagNonSerializableValues(rootNode)

    const collection = createTreeCollection<JsonNode>({ nodeToValue, nodeToString, rootNode })
    const defaultExpandedValue =
      defaultExpandedDepth != null ? getBranchValues(collection, defaultExpandedDepth) : undefined

    const rest: Record<string, unknown> = {}
    for (const key in record) {
      const isJsonTreeOption = (jsonTreeOptionKeys as readonly string[]).includes(key)
      if (key !== 'data' && key !== 'defaultExpandedDepth' && !isJsonTreeOption) {
        rest[key] = record[key]
      }
    }

    return { ...rest, collection, defaultExpandedValue } as UseTreeViewProps<JsonNode>
  })

  return { ...api, options: jsonTreeProps } as UseJsonTreeViewReturn
}
