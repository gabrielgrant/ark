import * as ratingGroup from '@zag-js/rating-group'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'
import { useFieldContext } from '../field/use-field-context.ts'

export interface UseRatingGroupProps extends Optional<Omit<ratingGroup.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseRatingGroupReturn extends ratingGroup.Api<PropTypes> {}

export const useRatingGroup = (props: () => UseRatingGroupProps): UseRatingGroupReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()

  const service = useMachine(
    ratingGroup.machine,
    () =>
      ({
        id,
        ids: {
          label: field?.ids.label,
          hiddenInput: field?.ids.control,
        },
        disabled: field?.disabled,
        readOnly: field?.readOnly,
        required: field?.required,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as ratingGroup.Props,
  )

  return ratingGroup.connect(service, normalizeProps)
}
