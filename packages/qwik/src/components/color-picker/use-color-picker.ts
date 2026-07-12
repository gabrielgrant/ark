import * as colorPicker from '@zag-js/color-picker'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import '../../serializers.ts'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'
import { useFieldContext } from '../field/use-field-context.ts'

export interface UseColorPickerProps extends Optional<Omit<colorPicker.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseColorPickerReturn extends colorPicker.Api<PropTypes> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 *
 * The side-effect import of `../../serializers.ts` above registers the
 * `ark.color` value-serializer once per module graph -- the machine's `value`
 * context holds a `@zag-js/color-utils` `Color` class instance, and the
 * serializer makes that context SSR-resumable. See `src/serializers.ts`.
 */
export const useColorPicker = (props: () => UseColorPickerProps): UseColorPickerReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()

  const service = useMachine(
    colorPicker.machine,
    () =>
      ({
        id,
        ids: {
          label: field?.ids.label,
          input: field?.ids.control,
        },
        dir: locale.dir,
        disabled: field?.disabled,
        invalid: field?.invalid,
        readOnly: field?.readOnly,
        required: field?.required,
        getRootNode: env.getRootNode,
        ...props(),
      }) as colorPicker.Props,
  )

  return colorPicker.connect(service, normalizeProps)
}
