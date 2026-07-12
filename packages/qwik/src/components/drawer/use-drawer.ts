import type { Machine } from '@zag-js/core'
import * as drawer from '@zag-js/drawer'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'
import { useDrawerStackStore } from './use-drawer-stack-store.ts'

export interface UseDrawerProps extends Optional<Omit<drawer.Props, 'dir' | 'getRootNode' | 'defaultSnapPoint'>, 'id'> {
  defaultSnapPoint?: drawer.SnapPoint | undefined
}
export interface UseDrawerReturn extends drawer.Api<PropTypes> {}

// what `useMachine` expects: the machine's schema props (drawer.Props with
// defaults applied — notably WITHOUT `null` in `defaultSnapPoint`, which is
// why UseDrawerProps re-narrows that field above, mirroring Solid/React).
type DrawerSchema = drawer.Machine extends Machine<infer T> ? T : never
type DrawerMachineProps = Partial<DrawerSchema['props']>

export const useDrawer = (props: () => UseDrawerProps): UseDrawerReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const stack = useDrawerStackStore()

  const service = useMachine(
    drawer.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        stack: stack?.stack,
        ...props(),
      }) as DrawerMachineProps,
  )

  return drawer.connect(service, normalizeProps)
}
