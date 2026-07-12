import type { OpenChangeDetails, SnapPointChangeDetails, TriggerValueChangeDetails } from '@zag-js/drawer'
import { type QRL, Slot, component$, useStore } from '@qwik.dev/core'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type RenderStrategyProps, RenderStrategyProvider } from '../../utils/render-strategy.ts'
import { PresenceProvider, type UsePresenceProps, usePresence } from '../presence/index.ts'
import { DrawerProvider } from './use-drawer-context.ts'
import { type UseDrawerProps, useDrawer } from './use-drawer.ts'

const machinePropKeys = [
  'closeOnEscape',
  'closeOnInteractOutside',
  'closeThreshold',
  'defaultOpen',
  'defaultSnapPoint',
  'defaultTriggerValue',
  'finalFocusEl',
  'id',
  'ids',
  'initialFocusEl',
  'modal',
  'onEscapeKeyDown',
  'onFocusOutside',
  'onInteractOutside',
  'onOpenChange',
  'onPointerDownOutside',
  'onRequestDismiss',
  'onSnapPointChange',
  'onTriggerValueChange',
  'open',
  'preventDragOnScroll',
  'preventScroll',
  'restoreFocus',
  'role',
  'snapPoint',
  'snapPoints',
  'snapToSequentialPoints',
  'swipeDirection',
  'swipeVelocityThreshold',
  'trapFocus',
  'triggerValue',
] as const

const presencePropKeys = ['immediate', 'onExitComplete', 'skipAnimationOnMount'] as const

export interface DrawerRootBaseProps extends UseDrawerProps, UsePresenceProps {
  /**
   * QRL variant of `onOpenChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onOpenChange$?: QRL<(details: OpenChangeDetails) => void>
  /** QRL variant of `onSnapPointChange`. */
  onSnapPointChange$?: QRL<(details: SnapPointChangeDetails) => void>
  /** QRL variant of `onTriggerValueChange`. */
  onTriggerValueChange$?: QRL<(details: TriggerValueChangeDetails) => void>
  /** QRL variant of `onExitComplete`. */
  onExitComplete$?: QRL<() => void>
}
export interface DrawerRootProps extends DrawerRootBaseProps {}

export const DrawerRoot = component$<DrawerRootProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const api = useDrawer(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }
    const plainOpen = record.onOpenChange as ((details: OpenChangeDetails) => void) | undefined
    const qrlOpen = record.onOpenChange$ as QRL<(details: OpenChangeDetails) => void> | undefined
    if (plainOpen || qrlOpen) {
      machineProps.onOpenChange = (details: OpenChangeDetails) => {
        plainOpen?.(details)
        void qrlOpen?.(details)
      }
    }
    const plainSnap = record.onSnapPointChange as ((details: SnapPointChangeDetails) => void) | undefined
    const qrlSnap = record.onSnapPointChange$ as QRL<(details: SnapPointChangeDetails) => void> | undefined
    if (plainSnap || qrlSnap) {
      machineProps.onSnapPointChange = (details: SnapPointChangeDetails) => {
        plainSnap?.(details)
        void qrlSnap?.(details)
      }
    }
    const plainTrigger = record.onTriggerValueChange as ((details: TriggerValueChangeDetails) => void) | undefined
    const qrlTrigger = record.onTriggerValueChange$ as QRL<(details: TriggerValueChangeDetails) => void> | undefined
    if (plainTrigger || qrlTrigger) {
      machineProps.onTriggerValueChange = (details: TriggerValueChangeDetails) => {
        plainTrigger?.(details)
        void qrlTrigger?.(details)
      }
    }
    return machineProps as UseDrawerProps
  })

  const drawerStore = useApiStore(api)
  DrawerProvider(drawerStore)

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
