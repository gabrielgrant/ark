import * as floatingPanel from '@zag-js/floating-panel'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UseFloatingPanelProps extends Optional<Omit<floatingPanel.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseFloatingPanelReturn extends floatingPanel.Api<PropTypes> {}

export const useFloatingPanel = (props: () => UseFloatingPanelProps): UseFloatingPanelReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    floatingPanel.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as floatingPanel.Props,
  )

  return floatingPanel.connect(service, normalizeProps)
}
