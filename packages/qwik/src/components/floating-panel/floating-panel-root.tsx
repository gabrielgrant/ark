import type {
  OpenChangeDetails,
  PositionChangeDetails,
  SizeChangeDetails,
  StageChangeDetails,
} from '@zag-js/floating-panel'
import { type QRL, Slot, component$, noSerialize, useStore } from '@qwik.dev/core'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type RenderStrategyProps, RenderStrategyProvider } from '../../utils/render-strategy.ts'
import { PresenceProvider, type UsePresenceProps, usePresence } from '../presence/index.ts'
import { FloatingPanelProvider } from './use-floating-panel-context.ts'
import { type UseFloatingPanelProps, useFloatingPanel } from './use-floating-panel.ts'

const machinePropKeys = [
  'allowOverflow',
  'closeOnEscape',
  'defaultOpen',
  'defaultPosition',
  'defaultSize',
  'disabled',
  'draggable',
  'finalFocusEl',
  'getAnchorPosition',
  'getBoundaryEl',
  'gridSize',
  'id',
  'ids',
  'initialFocusEl',
  'lockAspectRatio',
  'maxSize',
  'minSize',
  'onOpenChange',
  'onPositionChange',
  'onPositionChangeEnd',
  'onSizeChange',
  'onSizeChangeEnd',
  'onStageChange',
  'open',
  'persistRect',
  'position',
  'resizable',
  'restoreFocus',
  'size',
  'strategy',
  'translations',
] as const

const presencePropKeys = ['immediate', 'onExitComplete', 'skipAnimationOnMount'] as const

export interface FloatingPanelRootBaseProps extends UseFloatingPanelProps, UsePresenceProps {
  /**
   * QRL variant of `onOpenChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onOpenChange$?: QRL<(details: OpenChangeDetails) => void>
  /** QRL variant of `onStageChange`. */
  onStageChange$?: QRL<(details: StageChangeDetails) => void>
  /** QRL variant of `onPositionChangeEnd` (notification-style; see R9). */
  onPositionChangeEnd$?: QRL<(details: PositionChangeDetails) => void>
  /** QRL variant of `onSizeChangeEnd` (notification-style; see R9). */
  onSizeChangeEnd$?: QRL<(details: SizeChangeDetails) => void>
  /** QRL variant of `onExitComplete`. */
  onExitComplete$?: QRL<() => void>
}
export interface FloatingPanelRootProps extends FloatingPanelRootBaseProps {}

/**
 * NOTE: `onPositionChange`/`onSizeChange` fire on every pointermove frame
 * during a drag/resize — they stay plain-function-only (no QRL variant, R12):
 * an async QRL cannot keep up per-frame and ordering would not be guaranteed.
 * `getAnchorPosition`/`getBoundaryEl` are synchronous-return callbacks the
 * machine consumes — plain-function-only for the same reason.
 */
export const FloatingPanelRoot = component$<FloatingPanelRootProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  /**
   * Function-valued machine props delivered through Root (element getters and
   * per-frame callbacks) would crash Qwik's SSR serializer — tag them (R15).
   */
  for (const key of [
    'getAnchorPosition',
    'getBoundaryEl',
    'initialFocusEl',
    'finalFocusEl',
    'onPositionChange',
    'onSizeChange',
  ]) {
    const value = record[key]
    if (typeof value === 'function') noSerialize(value)
  }

  const api = useFloatingPanel(() => {
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
    const plainStage = record.onStageChange as ((details: StageChangeDetails) => void) | undefined
    const qrlStage = record.onStageChange$ as QRL<(details: StageChangeDetails) => void> | undefined
    if (plainStage || qrlStage) {
      machineProps.onStageChange = (details: StageChangeDetails) => {
        plainStage?.(details)
        void qrlStage?.(details)
      }
    }
    const plainPosEnd = record.onPositionChangeEnd as ((details: PositionChangeDetails) => void) | undefined
    const qrlPosEnd = record.onPositionChangeEnd$ as QRL<(details: PositionChangeDetails) => void> | undefined
    if (plainPosEnd || qrlPosEnd) {
      machineProps.onPositionChangeEnd = (details: PositionChangeDetails) => {
        plainPosEnd?.(details)
        void qrlPosEnd?.(details)
      }
    }
    const plainSizeEnd = record.onSizeChangeEnd as ((details: SizeChangeDetails) => void) | undefined
    const qrlSizeEnd = record.onSizeChangeEnd$ as QRL<(details: SizeChangeDetails) => void> | undefined
    if (plainSizeEnd || qrlSizeEnd) {
      machineProps.onSizeChangeEnd = (details: SizeChangeDetails) => {
        plainSizeEnd?.(details)
        void qrlSizeEnd?.(details)
      }
    }
    return machineProps as UseFloatingPanelProps
  })

  const panelStore = useApiStore(api)
  FloatingPanelProvider(panelStore)

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
