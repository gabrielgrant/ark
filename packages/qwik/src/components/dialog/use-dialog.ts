import * as dialog from '@zag-js/dialog'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UseDialogProps extends Optional<Omit<dialog.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseDialogReturn extends dialog.Api<PropTypes> {}

export const useDialog = (props: () => UseDialogProps): UseDialogReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    dialog.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as dialog.Props,
  )

  return dialog.connect(service, normalizeProps)
}
