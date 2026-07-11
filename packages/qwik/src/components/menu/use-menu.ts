import * as menu from '@zag-js/menu'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UseMenuProps extends Optional<Omit<menu.Props, 'dir' | 'getRootNode'>, 'id'> {}

/**
 * Unlike other `useX` hooks in this package, `useMenu` returns both the
 * connected `api` AND the raw machine `service` -- nested menus need the
 * service itself (not just its `api`) to wire parent/child relationships via
 * `api.setParent`/`api.setChild` (see `menu-root.tsx`). Both are
 * non-serializable; callers must route them through the `noSerialize` store
 * contexts in `use-menu-context.ts` / `use-menu-machine-context.ts` (R2),
 * never as a plain `component$` prop.
 */
export interface UseMenuReturn {
  api: menu.Api<PropTypes>
  service: menu.Service
}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 */
export const useMenu = (props: () => UseMenuProps): UseMenuReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    menu.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as menu.Props,
  )

  const api = menu.connect(service, normalizeProps)

  return { api, service }
}
