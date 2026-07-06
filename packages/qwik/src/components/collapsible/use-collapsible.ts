import * as collapsible from '@zag-js/collapsible'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId, useSignal } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'
import { type RenderStrategyProps, splitRenderStrategyProps } from '../../utils/render-strategy.ts'

export interface UseCollapsibleProps
  extends Optional<Omit<collapsible.Props, 'dir' | 'getRootNode'>, 'id'>, RenderStrategyProps {}

export interface UseCollapsibleReturn extends collapsible.Api<PropTypes> {
  /**
   * Whether the content is unmounted
   */
  unmounted?: boolean
}

export const useCollapsible = (props: () => UseCollapsibleProps): UseCollapsibleReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const wasVisibleSig = useSignal(false)

  const service = useMachine(collapsible.machine, () => {
    const [, collapsibleProps] = splitRenderStrategyProps(props())
    return {
      id,
      dir: locale.dir,
      getRootNode: env.getRootNode,
      ...collapsibleProps,
    } as collapsible.Props
  })

  const api = collapsible.connect(service, normalizeProps)
  const [renderStrategyProps] = splitRenderStrategyProps(props())

  if (api.visible && !wasVisibleSig.value) wasVisibleSig.value = true

  return {
    ...api,
    unmounted:
      (!api.visible && !wasVisibleSig.value && renderStrategyProps.lazyMount) ||
      (renderStrategyProps.unmountOnExit && !api.visible && wasVisibleSig.value),
  }
}
