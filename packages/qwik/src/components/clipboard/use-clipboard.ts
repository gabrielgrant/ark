import * as clipboard from '@zag-js/clipboard'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import type { Optional } from '../../types.ts'

export interface UseClipboardProps extends Optional<Omit<clipboard.Props, 'getRootNode'>, 'id'> {}
export interface UseClipboardReturn extends clipboard.Api<PropTypes> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 */
export const useClipboard = (props: () => UseClipboardProps): UseClipboardReturn => {
  const id = useId()
  const env = useEnvironmentContext()

  const service = useMachine(
    clipboard.machine,
    () =>
      ({
        id,
        getRootNode: env.getRootNode,
        ...props(),
      }) as clipboard.Props,
  )

  return clipboard.connect(service, normalizeProps)
}
