import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import * as zagSwitch from '@zag-js/switch'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'
import { useFieldContext } from '../field/use-field-context.ts'

export interface UseSwitchProps extends Optional<Omit<zagSwitch.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseSwitchReturn extends zagSwitch.Api<PropTypes> {}

export const useSwitch = (props: () => UseSwitchProps): UseSwitchReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()

  const service = useMachine(
    zagSwitch.machine,
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
      }) as zagSwitch.Props,
  )

  return zagSwitch.connect(service, normalizeProps)
}
