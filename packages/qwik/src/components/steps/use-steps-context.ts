import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseStepsReturn } from './use-steps.ts'

/**
 * The machine `api` is a bag of non-serializable closures, so it is shared as a
 * `noSerialize` value inside a store created by `<Steps.Root>` (see
 * `useApiStore`). Parts read `store.api` (subscribing) and re-render when the
 * owner recomputes it. `api` is `undefined` while the component is dormant
 * (pre-wake) on the client — parts must guard for it. See PLAN.md, rule R2.
 */
export interface StepsApiStore extends ApiStore<UseStepsReturn> {}

export const [StepsProvider, useStepsStore] = createContext<StepsApiStore>({
  name: 'ark.steps',
  hookName: 'useStepsContext',
  providerName: '<Steps.Root />',
})

export interface UseStepsContext extends UseStepsReturn {}

export const useStepsContext = (): UseStepsReturn | undefined => useStepsStore().api
