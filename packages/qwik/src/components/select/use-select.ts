import * as select from '@zag-js/select'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'
import type { CollectionItem, ListCollection } from '../collection.ts'
import { useFieldContext } from '../field/use-field-context.ts'

export interface UseSelectProps<T extends CollectionItem>
  extends Optional<Omit<select.Props<T>, 'dir' | 'getRootNode' | 'collection'>, 'id'> {
  /**
   * The collection of items. Constructed once (usually via
   * `createListCollection`) and passed straight into the machine's props
   * getter below -- it never crosses a serializable boundary (see
   * `collection.ts`).
   */
  collection: ListCollection<T>
}

export interface UseSelectReturn<T extends CollectionItem> extends select.Api<PropTypes, T> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 */
export const useSelect = <T extends CollectionItem>(props: () => UseSelectProps<T>): UseSelectReturn<T> => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()

  const service = useMachine(
    select.machine,
    () =>
      ({
        id,
        ids: {
          label: field?.ids.label,
          hiddenSelect: field?.ids.control,
        },
        disabled: field?.disabled,
        readOnly: field?.readOnly,
        invalid: field?.invalid,
        required: field?.required,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as select.Props<T>,
  )

  return select.connect<PropTypes, T>(service, normalizeProps)
}
