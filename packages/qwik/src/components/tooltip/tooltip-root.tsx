import type { OpenChangeDetails } from '@zag-js/tooltip'
import { type QRL, Slot, component$, useStore } from '@qwik.dev/core'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type RenderStrategyProps, RenderStrategyProvider } from '../../utils/render-strategy.ts'
import { PresenceProvider, type UsePresenceProps, usePresence } from '../presence/index.ts'
import { TooltipProvider } from './use-tooltip-context.ts'
import { type UseTooltipProps, useTooltip } from './use-tooltip.ts'

const machinePropKeys = [
  'aria-label',
  'closeDelay',
  'closeOnClick',
  'closeOnEscape',
  'closeOnPointerDown',
  'closeOnScroll',
  'defaultOpen',
  'disabled',
  'id',
  'ids',
  'interactive',
  'onOpenChange',
  'open',
  'openDelay',
  'positioning',
  'triggerValue',
  'defaultTriggerValue',
  'onTriggerValueChange',
] as const

const presencePropKeys = ['immediate', 'onExitComplete', 'skipAnimationOnMount'] as const

export interface TooltipRootBaseProps extends UseTooltipProps, UsePresenceProps {
  /**
   * QRL variant of `onOpenChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onOpenChange$?: QRL<(details: OpenChangeDetails) => void>
  /** QRL variant of `onExitComplete`. */
  onExitComplete$?: QRL<() => void>
}
export interface TooltipRootProps extends TooltipRootBaseProps {}

export const TooltipRoot = component$<TooltipRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useTooltip(() => {
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
    return machineProps as UseTooltipProps
  })

  const tooltipStore = useApiStore(api)
  TooltipProvider(tooltipStore)

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
