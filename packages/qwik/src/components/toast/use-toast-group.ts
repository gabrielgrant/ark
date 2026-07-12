import * as toast from '@zag-js/toast'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'

export interface UseToastGroupProps {
  store: toast.Store
}
export interface UseToastGroupReturn {
  api: toast.GroupApi<PropTypes>
  /** The raw group service — passed as `parent` to each per-toast machine. */
  service: toast.GroupService
}

export const useToastGroup = (props: () => UseToastGroupProps): UseToastGroupReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    toast.group.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as toast.GroupProps,
  )

  return { api: toast.group.connect(service, normalizeProps), service }
}
