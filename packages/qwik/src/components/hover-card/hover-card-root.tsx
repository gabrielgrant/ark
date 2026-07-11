import type { OpenChangeDetails } from '@zag-js/hover-card'
import { type QRL, Slot, component$, useStore } from '@qwik.dev/core'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type RenderStrategyProps, RenderStrategyProvider } from '../../utils/render-strategy.ts'
import { PresenceProvider, type UsePresenceProps, usePresence } from '../presence/index.ts'
import { HoverCardProvider } from './use-hover-card-context.ts'
import { type UseHoverCardProps, useHoverCard } from './use-hover-card.ts'

const machinePropKeys = [
  'closeDelay',
  'defaultOpen',
  'disabled',
  'id',
  'ids',
  'onFocusOutside',
  'onInteractOutside',
  'onOpenChange',
  'onPointerDownOutside',
  'open',
  'openDelay',
  'positioning',
  'triggerValue',
  'defaultTriggerValue',
  'onTriggerValueChange',
] as const

const presencePropKeys = ['immediate', 'onExitComplete', 'skipAnimationOnMount'] as const

export interface HoverCardRootBaseProps extends UseHoverCardProps, UsePresenceProps {
  /**
   * QRL variant of `onOpenChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onOpenChange$?: QRL<(details: OpenChangeDetails) => void>
  /** QRL variant of `onExitComplete`. */
  onExitComplete$?: QRL<() => void>
}
export interface HoverCardRootProps extends HoverCardRootBaseProps {}

export const HoverCardRoot = component$<HoverCardRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useHoverCard(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }
    const plain = record.onOpenChange as ((details: OpenChangeDetails) => void) | undefined
    const qrl = record.onOpenChange$ as QRL<(details: OpenChangeDetails) => void> | undefined
    if (plain || qrl) {
      machineProps.onOpenChange = (details: OpenChangeDetails) => {
        plain?.(details)
        void qrl?.(details)
      }
    }
    return machineProps as UseHoverCardProps
  })

  const hoverCardStore = useApiStore(api)
  HoverCardProvider(hoverCardStore)

  const renderStrategy = useStore<RenderStrategyProps>({})
  renderStrategy.lazyMount = props.lazyMount
  renderStrategy.unmountOnExit = props.unmountOnExit
  RenderStrategyProvider(renderStrategy)

  const presenceApi = usePresence(() => {
    const presenceProps: Record<string, unknown> = {
      lazyMount: record.lazyMount,
      unmountOnExit: record.unmountOnExit,
    }
    for (const key of presencePropKeys) {
      if (key in record) presenceProps[key] = record[key]
    }
    const plainExit = record.onExitComplete as (() => void) | undefined
    const qrlExit = record.onExitComplete$ as QRL<() => void> | undefined
    if (plainExit || qrlExit) {
      presenceProps.onExitComplete = () => {
        plainExit?.()
        void qrlExit?.()
      }
    }
    presenceProps.present = api.open
    return presenceProps as UsePresenceProps
  })

  const presenceStore = useApiStore(presenceApi)
  PresenceProvider(presenceStore)

  return <Slot />
})
