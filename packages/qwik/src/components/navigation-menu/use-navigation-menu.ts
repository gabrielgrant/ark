import * as navigationMenu from '@zag-js/navigation-menu'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UseNavigationMenuProps
  extends Optional<Omit<navigationMenu.Props, 'dir' | 'getRootNode'>, 'id'> {}

export interface UseNavigationMenuReturn extends navigationMenu.Api<PropTypes> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 */
export const useNavigationMenu = (props: () => UseNavigationMenuProps): UseNavigationMenuReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    navigationMenu.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as navigationMenu.Props,
  )

  return navigationMenu.connect(service, normalizeProps)
}
