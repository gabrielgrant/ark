import { noSerialize } from '@qwik.dev/core'
import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseTourReturn } from './use-tour.ts'

/**
 * The machine `api` is a bag of non-serializable closures, so it is shared as a
 * `noSerialize` value inside a store created by `<Tour.Root>` (see
 * `useApiStore`). Parts read `store.api` (subscribing) and re-render when the
 * owner recomputes it. `api` is `undefined` while the component is dormant
 * (pre-wake) on the client — parts must guard for it. See PLAN.md, rule R2.
 */
export interface TourApiStore extends ApiStore<UseTourReturn> {}

export const [TourProvider, useTourStore] = createContext<TourApiStore>({
  name: 'ark.tour',
  hookName: 'useTourContext',
  providerName: '<Tour.Root />',
})

export interface UseTourContext extends UseTourReturn {}

const tag = (v: unknown) => {
  if (typeof v === 'object' && v !== null) noSerialize(v)
}

/**
 * `api.step` (the current step) carries user-authored function fields
 * (`target`, `effect`, `actions[].action`) — reading it through the R2 store
 * retains those closures in Qwik's SSR serialization graph and crashes with
 * Q20 (same class of bug as DatePicker's `DateValue` fields, PLAN.md R18).
 * `connect()` recomputes `step` fresh every render, so it is re-tagged on
 * every context read here, mirroring `useDatePickerContext`.
 */
const tagStep = (api: UseTourReturn) => {
  tag(api.step)
  return api
}

export const useTourContext = (): UseTourReturn | undefined => {
  const api = useTourStore().api
  return api ? tagStep(api) : undefined
}
