import * as pinInput from '@zag-js/pin-input'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'
import { useFieldContext } from '../field/use-field-context.ts'

export interface UsePinInputProps extends Optional<Omit<pinInput.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UsePinInputReturn extends pinInput.Api<PropTypes> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 */
export const usePinInput = (props: () => UsePinInputProps): UsePinInputReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()

  const service = useMachine(
    pinInput.machine,
    () =>
      ({
        id,
        ids: {
          label: field?.ids.label,
          hiddenInput: field?.ids.control,
        },
        disabled: field?.disabled,
        readOnly: field?.readOnly,
        invalid: field?.invalid,
        required: field?.required,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as pinInput.Props,
  )

  return pinInput.connect(service, normalizeProps)
}
