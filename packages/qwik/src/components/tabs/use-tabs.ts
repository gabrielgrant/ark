import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import * as tabs from '@zag-js/tabs'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UseTabsProps extends Optional<Omit<tabs.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseTabsReturn extends tabs.Api<PropTypes> {}

export const useTabs = (props: () => UseTabsProps): UseTabsReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    tabs.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as tabs.Props,
  )

  return tabs.connect(service, normalizeProps)
}
