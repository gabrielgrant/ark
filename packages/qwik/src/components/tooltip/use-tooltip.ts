import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import * as tooltip from '@zag-js/tooltip'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UseTooltipProps extends Optional<Omit<tooltip.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseTooltipReturn extends tooltip.Api<PropTypes> {}

export const useTooltip = (props: () => UseTooltipProps): UseTooltipReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    tooltip.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as tooltip.Props,
  )

  return tooltip.connect(service, normalizeProps)
}
