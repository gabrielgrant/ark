import * as numberInput from '@zag-js/number-input'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'
import { useFieldContext } from '../field/use-field-context.ts'

export interface UseNumberInputProps extends Optional<Omit<numberInput.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseNumberInputReturn extends numberInput.Api<PropTypes> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 */
export const useNumberInput = (props: () => UseNumberInputProps): UseNumberInputReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()

  const service = useMachine(
    numberInput.machine,
    () =>
      ({
        id,
        ids: {
          label: field?.ids.label,
          input: field?.ids.control,
        },
        disabled: field?.disabled,
        readOnly: field?.readOnly,
        invalid: field?.invalid,
        required: field?.required,
        dir: locale.dir,
        locale: locale.locale,
        getRootNode: env.getRootNode,
        ...props(),
      }) as numberInput.Props,
  )

  return numberInput.connect(service, normalizeProps)
}
