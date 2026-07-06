import * as avatar from '@zag-js/avatar'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UseAvatarProps extends Optional<Omit<avatar.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseAvatarReturn extends avatar.Api<PropTypes> {}

export const useAvatar = (props: () => UseAvatarProps): UseAvatarReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    avatar.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as avatar.Props,
  )

  return avatar.connect(service, normalizeProps)
}
