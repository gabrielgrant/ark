import * as hoverCard from '@zag-js/hover-card'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UseHoverCardProps extends Optional<Omit<hoverCard.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseHoverCardReturn extends hoverCard.Api<PropTypes> {}

export const useHoverCard = (props: () => UseHoverCardProps): UseHoverCardReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    hoverCard.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as hoverCard.Props,
  )

  return hoverCard.connect(service, normalizeProps)
}
