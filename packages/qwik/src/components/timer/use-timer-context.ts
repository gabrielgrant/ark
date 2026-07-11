import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseTimerReturn } from './use-timer.ts'

/**
 * The machine `api` is a bag of non-serializable closures, so it is shared as a
 * `noSerialize` value inside a store created by `<Timer.Root>` (see
 * `useApiStore`). Parts read `store.api` (subscribing) and re-render when the
 * owner recomputes it. `api` is `undefined` while the component is dormant
 * (pre-wake) on the client — parts must guard for it. See PLAN.md, rule R2.
 */
export interface TimerApiStore extends ApiStore<UseTimerReturn> {}

export const [TimerProvider, useTimerStore] = createContext<TimerApiStore>({
  name: 'ark.timer',
  hookName: 'useTimerContext',
  providerName: '<Timer.Root />',
})

export interface UseTimerContext extends UseTimerReturn {}

export const useTimerContext = (): UseTimerReturn | undefined => useTimerStore().api
