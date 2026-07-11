import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseDateInputReturn } from './use-date-input.ts'

/**
 * The machine `api` is a bag of non-serializable closures, so it is shared as a
 * `noSerialize` value inside a store created by `<DateInput.Root>` (see
 * `useApiStore`). Parts read `store.api` (subscribing) and re-render when the
 * owner recomputes it. `api` is `undefined` while the component is dormant
 * (pre-wake) on the client -- parts must guard for it. See PLAN.md, rule R2.
 */
export interface DateInputApiStore extends ApiStore<UseDateInputReturn> {}

export const [DateInputProvider, useDateInputStore] = createContext<DateInputApiStore>({
  name: 'ark.date-input',
  hookName: 'useDateInputContext',
  providerName: '<DateInput.Root />',
})

export interface UseDateInputContext extends UseDateInputReturn {}

export const useDateInputContext = (): UseDateInputReturn | undefined => useDateInputStore().api
