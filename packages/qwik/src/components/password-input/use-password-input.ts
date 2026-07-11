import * as passwordInput from '@zag-js/password-input'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'
import { useFieldContext } from '../field/use-field-context.ts'

export interface UsePasswordInputProps
  extends Optional<Omit<passwordInput.Props, 'dir' | 'getRootNode'>, 'id'> {}

export interface UsePasswordInputReturn extends passwordInput.Api<PropTypes> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 */
export const usePasswordInput = (props: () => UsePasswordInputProps): UsePasswordInputReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()

  const service = useMachine(
    passwordInput.machine,
    () =>
      ({
        id,
        ids: {
          input: field?.ids.control,
        },
        disabled: field?.disabled,
        readOnly: field?.readOnly,
        required: field?.required,
        invalid: field?.invalid,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as passwordInput.Props,
  )

  return passwordInput.connect<PropTypes>(service, normalizeProps)
}
