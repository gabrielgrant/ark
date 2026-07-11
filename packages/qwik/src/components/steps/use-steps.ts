import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import * as steps from '@zag-js/steps'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UseStepsProps extends Optional<Omit<steps.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseStepsReturn extends steps.Api<PropTypes> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 */
export const useSteps = (props: () => UseStepsProps): UseStepsReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    steps.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as steps.Props,
  )

  return steps.connect(service, normalizeProps)
}
