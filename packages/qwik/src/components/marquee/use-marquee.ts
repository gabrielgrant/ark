import * as marquee from '@zag-js/marquee'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UseMarqueeProps extends Optional<Omit<marquee.Props, 'dir' | 'getRootNode'>, 'id'> {}

export interface UseMarqueeReturn extends marquee.Api<PropTypes> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 */
export const useMarquee = (props: () => UseMarqueeProps): UseMarqueeReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    marquee.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as marquee.Props,
  )

  return marquee.connect<PropTypes>(service, normalizeProps)
}
