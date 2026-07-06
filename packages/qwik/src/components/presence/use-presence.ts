import * as presence from '@zag-js/presence'
import { normalizeProps, useMachine } from '@zag-js/qwik'
import { type Signal, useSignal } from '@qwik.dev/core'
import type { Optional } from '../../types.ts'
import { type RenderStrategyProps, splitRenderStrategyProps } from '../../utils/render-strategy.ts'

export interface UsePresenceProps extends Optional<presence.Props, 'present'>, RenderStrategyProps {
  /**
   * Whether to allow the initial presence animation.
   * @default false
   */
  skipAnimationOnMount?: boolean
}

export interface UsePresenceReturn {
  unmounted: boolean
  present: boolean
  /**
   * Bind to the animated element (`ref={presence.ref}`). A Signal (not a
   * function ref) so it survives SSR serialization; the node is forwarded to
   * the machine (`NODE.SET`) during render — safe pre-start because the
   * adapter buffers events until the machine starts.
   */
  ref: Signal<Element | undefined>
  presenceProps: { hidden?: boolean; 'data-state'?: 'open' | 'closed' }
}

export const usePresence = (props: () => UsePresenceProps): UsePresenceReturn => {
  const everPresentSig = useSignal(false)
  const nodeSig = useSignal<Element>()

  const service = useMachine(presence.machine, () => {
    const [, machineProps] = splitRenderStrategyProps(props())
    const { skipAnimationOnMount: _, ...rest } = machineProps
    return { present: false, ...rest }
  })
  const api = presence.connect(service, normalizeProps)

  const [renderStrategyProps, localProps] = splitRenderStrategyProps(props())

  if (api.present && !everPresentSig.value) everPresentSig.value = true
  if (nodeSig.value) service.send({ type: 'NODE.SET', node: nodeSig.value })

  const unmounted =
    (!api.present && !everPresentSig.value && renderStrategyProps.lazyMount) ||
    (renderStrategyProps.unmountOnExit && !api.present && everPresentSig.value)

  return {
    unmounted: Boolean(unmounted),
    present: api.present,
    ref: nodeSig,
    presenceProps: {
      hidden: !api.present,
      'data-state':
        api.skip && localProps.skipAnimationOnMount ? undefined : localProps.present ? 'open' : 'closed',
    },
  }
}
