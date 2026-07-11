import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import * as timer from '@zag-js/timer'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import type { Optional } from '../../types.ts'

export interface UseTimerProps extends Optional<Omit<timer.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseTimerReturn extends timer.Api<PropTypes> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 */
export const useTimer = (props: () => UseTimerProps): UseTimerReturn => {
  const id = useId()
  const env = useEnvironmentContext()

  const service = useMachine(
    timer.machine,
    () =>
      ({
        id,
        getRootNode: env.getRootNode,
        ...props(),
      }) as timer.Props,
  )

  return timer.connect(service, normalizeProps)
}
