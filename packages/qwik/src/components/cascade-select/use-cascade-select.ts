import * as cascadeSelect from '@zag-js/cascade-select'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'
import type { TreeCollection, TreeNode } from '../collection.ts'

export interface UseCascadeSelectProps<T extends TreeNode>
  extends Optional<Omit<cascadeSelect.Props<T>, 'dir' | 'getRootNode' | 'collection'>, 'id'> {
  /**
   * The tree collection data. Constructed once (usually via
   * `createTreeCollection`) and passed straight into the machine's props
   * getter below -- it never crosses a serializable boundary (see
   * `collection.ts`).
   */
  collection: TreeCollection<T>
}

export interface UseCascadeSelectReturn<T extends TreeNode> extends cascadeSelect.Api<PropTypes, T> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 */
export const useCascadeSelect = <T extends TreeNode>(
  props: () => UseCascadeSelectProps<T>,
): UseCascadeSelectReturn<T> => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    cascadeSelect.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as cascadeSelect.Props<T>,
  )

  return cascadeSelect.connect<PropTypes, T>(service, normalizeProps)
}
