import * as toast from '@zag-js/toast'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useEnvironmentContext } from '../../providers/environment/index.ts'

export interface UseToastProps extends toast.Props {}
export interface UseToastReturn extends toast.Api<PropTypes> {}

/**
 * Owns a single toast's machine. Unlike the other `use-<x>` hooks this is not
 * driven by public Root props — it is wired entirely by `ToastActor` from a
 * toast-group item (`toast.group.machine`'s `toasts` context) plus `parent`
 * (the group service) and `index`. See PLAN.md R2/R4.
 */
export const useToast = (props: () => UseToastProps): UseToastReturn => {
  const env = useEnvironmentContext()

  const service = useMachine(
    toast.machine,
    () =>
      ({
        getRootNode: env.getRootNode,
        ...props(),
      }) as toast.Props,
  )

  return toast.connect(service, normalizeProps)
}
