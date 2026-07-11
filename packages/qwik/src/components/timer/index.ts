export type { TickDetails as TimerTickDetails } from '@zag-js/timer'
export {
  TimerActionTrigger,
  type TimerActionTriggerBaseProps,
  type TimerActionTriggerProps,
} from './timer-action-trigger.tsx'
export { TimerArea, type TimerAreaBaseProps, type TimerAreaProps } from './timer-area.tsx'
export { TimerControl, type TimerControlBaseProps, type TimerControlProps } from './timer-control.tsx'
export { TimerItem, type TimerItemBaseProps, type TimerItemProps } from './timer-item.tsx'
export { TimerRoot, type TimerRootBaseProps, type TimerRootProps } from './timer-root.tsx'
export { TimerSeparator, type TimerSeparatorBaseProps, type TimerSeparatorProps } from './timer-separator.tsx'
export { timerAnatomy } from './timer.anatomy.ts'
export { useTimer, type UseTimerProps, type UseTimerReturn } from './use-timer.ts'
export { useTimerContext, type UseTimerContext } from './use-timer-context.ts'

export * as Timer from './timer.ts'
