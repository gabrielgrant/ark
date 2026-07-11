import * as popover from '@zag-js/popover'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UsePopoverProps extends Optional<Omit<popover.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UsePopoverReturn extends popover.Api<PropTypes> {}

export const usePopover = (props: () => UsePopoverProps): UsePopoverReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    popover.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
        // R7: Qwik renders floating content inline (no JS portal), so the
        // machine's tab-order logic must agree with the actual DOM position.
        // Force `portalled: false` after spreading user props, matching the
        // zag qwik example app (examples/qwik-ts/src/routes/popover/basic).
        portalled: false,
      }) as popover.Props,
  )

  return popover.connect(service, normalizeProps)
}
