import * as datePicker from '@zag-js/date-picker'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import '../../serializers.ts'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UseDatePickerProps extends Optional<Omit<datePicker.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseDatePickerReturn extends datePicker.Api<PropTypes> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 *
 * The side-effect import of `../../serializers.ts` above registers the
 * `DateValue` value-serializer once per module graph -- date-picker's context
 * (`value`, `focusedValue`, `startValue`, `hoveredValue`) is entirely
 * `@internationalized/date` `DateValue` instances (unlike date-input, it has
 * no analogue of `IncompleteDate`), so the single `ark.date` registration is
 * sufficient to make it SSR-resumable. See `src/serializers.ts`.
 */
export const useDatePicker = (props: () => UseDatePickerProps): UseDatePickerReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    datePicker.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        locale: locale.locale,
        getRootNode: env.getRootNode,
        ...props(),
      }) as datePicker.Props,
  )

  return datePicker.connect(service, normalizeProps)
}
