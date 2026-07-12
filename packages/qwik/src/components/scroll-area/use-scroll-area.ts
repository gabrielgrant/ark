import * as scrollArea from '@zag-js/scroll-area'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UseScrollAreaProps extends Optional<Omit<scrollArea.Props, 'dir' | 'getRootNode'>, 'id'> {}

export interface UseScrollAreaReturn extends scrollArea.Api<PropTypes> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 */
export const useScrollArea = (props: () => UseScrollAreaProps): UseScrollAreaReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    scrollArea.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as scrollArea.Props,
  )

  return scrollArea.connect<PropTypes>(service, normalizeProps)
}
