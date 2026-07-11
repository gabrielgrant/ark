import * as listbox from '@zag-js/listbox'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'
import type { CollectionItem, ListCollection } from '../collection.ts'

export interface UseListboxProps<T extends CollectionItem>
  extends Optional<Omit<listbox.Props<T>, 'dir' | 'getRootNode' | 'collection'>, 'id'> {
  /**
   * The collection of items. Constructed once (usually via
   * `createListCollection`) and passed straight into the machine's props
   * getter below -- it never crosses a serializable boundary (see
   * `collection.ts`).
   */
  collection: ListCollection<T>
}

export interface UseListboxReturn<T extends CollectionItem> extends listbox.Api<PropTypes, T> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 */
export const useListbox = <T extends CollectionItem>(props: () => UseListboxProps<T>): UseListboxReturn<T> => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    listbox.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as listbox.Props<T>,
  )

  return listbox.connect<PropTypes, T>(service, normalizeProps)
}
