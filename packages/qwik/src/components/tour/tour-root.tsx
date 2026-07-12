import type { StatusChangeDetails, StepChangeDetails, StepsChangeDetails } from '@zag-js/tour'
import { type QRL, Slot, component$, noSerialize, useStore } from '@qwik.dev/core'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type RenderStrategyProps, RenderStrategyProvider } from '../../utils/render-strategy.ts'
import { PresenceProvider, type UsePresenceProps, usePresence } from '../presence/index.ts'
import { TourProvider } from './use-tour-context.ts'
import { type UseTourProps, useTour } from './use-tour.ts'

const machinePropKeys = [
  'closeOnEscape',
  'closeOnInteractOutside',
  'id',
  'ids',
  'keyboardNavigation',
  'onFocusOutside',
  'onInteractOutside',
  'onPointerDownOutside',
  'onStatusChange',
  'onStepChange',
  'onStepsChange',
  'preventInteraction',
  'spotlightOffset',
  'spotlightRadius',
  'stepId',
  'steps',
  'translations',
] as const

const presencePropKeys = ['immediate', 'onExitComplete', 'skipAnimationOnMount'] as const

export interface TourRootBaseProps extends UseTourProps, UsePresenceProps {
  /** QRL variant of `onStatusChange`. Prefer this in Qwik apps for SSR-safety. */
  onStatusChange$?: QRL<(details: StatusChangeDetails) => void>
  /** QRL variant of `onStepChange`. Prefer this in Qwik apps for SSR-safety. */
  onStepChange$?: QRL<(details: StepChangeDetails) => void>
  /** QRL variant of `onStepsChange`. Prefer this in Qwik apps for SSR-safety. */
  onStepsChange$?: QRL<(details: StepsChangeDetails) => void>
}
export interface TourRootProps extends TourRootBaseProps {}

/**
 * Unlike Solid/React (whose `TourRoot` accepts an already-connected `tour`
 * api as a prop, built by the consumer calling `useTour()` elsewhere), this
 * Root owns the machine itself — matching every other Qwik port (R2/R6: an
 * `api` prop into a `component$` violates serializable-props). Descendants
 * that need to call methods imperatively (`.start()`, `.next()`, ...) read
 * `useTourContext()` themselves; capturing that context value inside an
 * `onClick$` works fine (verified empirically) as long as the component
 * calling `useTourContext()` has rendered at least once on the client.
 */
export const TourRoot = component$<TourRootProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  /**
   * `steps` carries user-authored function fields (`target`, `effect`,
   * `actions[].action`) and DOES enter Root as a normal `component$` prop, so
   * Qwik's SSR serializer would see it (crash Q20) — tagged here before use,
   * mirroring the `collection` prop pattern in select/listbox/combobox (R15).
   */
  if (Array.isArray(record.steps)) noSerialize(record.steps)

  const api = useTour(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }
    const plainStatus = record.onStatusChange as ((details: StatusChangeDetails) => void) | undefined
    const qrlStatus = record.onStatusChange$ as QRL<(details: StatusChangeDetails) => void> | undefined
    if (plainStatus || qrlStatus) {
      machineProps.onStatusChange = (details: StatusChangeDetails) => {
        plainStatus?.(details)
        void qrlStatus?.(details)
      }
    }
    const plainStep = record.onStepChange as ((details: StepChangeDetails) => void) | undefined
    const qrlStep = record.onStepChange$ as QRL<(details: StepChangeDetails) => void> | undefined
    if (plainStep || qrlStep) {
      machineProps.onStepChange = (details: StepChangeDetails) => {
        plainStep?.(details)
        void qrlStep?.(details)
      }
    }
    const plainSteps = record.onStepsChange as ((details: StepsChangeDetails) => void) | undefined
    const qrlSteps = record.onStepsChange$ as QRL<(details: StepsChangeDetails) => void> | undefined
    if (plainSteps || qrlSteps) {
      machineProps.onStepsChange = (details: StepsChangeDetails) => {
        plainSteps?.(details)
        void qrlSteps?.(details)
      }
    }
    return machineProps as UseTourProps
  })

  const store = useApiStore(api)
  TourProvider(store)

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
    presenceProps.present = api.open
    return presenceProps as UsePresenceProps
  })

  const presenceStore = useApiStore(presenceApi)
  PresenceProvider(presenceStore)

  return <Slot />
})
