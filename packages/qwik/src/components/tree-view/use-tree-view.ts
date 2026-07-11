import * as treeView from '@zag-js/tree-view'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'
import type { TreeCollection, TreeNode } from '../collection.ts'

export interface UseTreeViewProps<T extends TreeNode>
  extends Optional<Omit<treeView.Props<T>, 'dir' | 'getRootNode' | 'collection'>, 'id'> {
  /**
   * The tree collection data. Constructed once (usually via
   * `createTreeCollection`) and passed straight into the machine's props
   * getter below -- it never crosses a serializable boundary (see
   * `collection.ts`).
   */
  collection: TreeCollection<T>
}

export interface UseTreeViewReturn<T extends TreeNode> extends treeView.Api<PropTypes, T> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 */
export const useTreeView = <T extends TreeNode>(props: () => UseTreeViewProps<T>): UseTreeViewReturn<T> => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    treeView.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as treeView.Props<T>,
  )

  return treeView.connect<PropTypes, T>(service, normalizeProps)
}
