import * as radioGroup from '@zag-js/radio-group'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'
import { useFieldsetContext } from '../fieldset/use-fieldset-context.ts'

export interface UseRadioGroupProps extends Optional<Omit<radioGroup.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseRadioGroupReturn extends radioGroup.Api<PropTypes> {}

export const useRadioGroup = (props: () => UseRadioGroupProps): UseRadioGroupReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const fieldset = useFieldsetContext()

  const service = useMachine(
    radioGroup.machine,
    () =>
      ({
        id,
        ids: {
          label: fieldset?.ids.legend,
        },
        disabled: fieldset?.disabled,
        invalid: fieldset?.invalid,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as radioGroup.Props,
  )

  return radioGroup.connect(service, normalizeProps)
}
