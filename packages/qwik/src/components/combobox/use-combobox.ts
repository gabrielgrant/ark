import * as combobox from '@zag-js/combobox'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'
import type { CollectionItem, ListCollection } from '../collection.ts'
import { useFieldContext } from '../field/use-field-context.ts'

export interface UseComboboxProps<T extends CollectionItem>
  extends Optional<Omit<combobox.Props<T>, 'dir' | 'getRootNode' | 'collection'>, 'id'> {
  /**
   * The collection of items. Constructed once (usually via
   * `createListCollection`) and passed straight into the machine's props
   * getter below -- it never crosses a serializable boundary (see
   * `collection.ts`).
   */
  collection: ListCollection<T>
}

export interface UseComboboxReturn<T extends CollectionItem> extends combobox.Api<PropTypes, T> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 */
export const useCombobox = <T extends CollectionItem>(props: () => UseComboboxProps<T>): UseComboboxReturn<T> => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()

  const service = useMachine(
    combobox.machine,
    () =>
      ({
        id,
        ids: {
          label: field?.ids.label,
          input: field?.ids.control,
        },
        disabled: field?.disabled,
        readOnly: field?.readOnly,
        required: field?.required,
        invalid: field?.invalid,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as combobox.Props<T>,
  )

  return combobox.connect<PropTypes, T>(service, normalizeProps)
}
