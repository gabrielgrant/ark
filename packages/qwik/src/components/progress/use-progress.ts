import * as progress from '@zag-js/progress'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UseProgressProps extends Optional<Omit<progress.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseProgressReturn extends progress.Api<PropTypes> {}

export const useProgress = (props: () => UseProgressProps): UseProgressReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    progress.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        locale: locale.locale,
        getRootNode: env.getRootNode,
        ...props(),
      }) as progress.Props,
  )

  return progress.connect(service, normalizeProps)
}
