import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import * as toggleGroup from '@zag-js/toggle-group'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UseToggleGroupProps extends Optional<Omit<toggleGroup.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseToggleGroupReturn extends toggleGroup.Api<PropTypes> {}

export const useToggleGroup = (props: () => UseToggleGroupProps): UseToggleGroupReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    toggleGroup.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as toggleGroup.Props,
  )

  return toggleGroup.connect(service, normalizeProps)
}
