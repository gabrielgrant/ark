import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseNumberInputReturn } from './use-number-input.ts'

/**
 * The machine `api` is a bag of non-serializable closures, so it is shared as a
 * `noSerialize` value inside a store created by `<NumberInput.Root>` (see
 * `useApiStore`). Parts read `store.api` (subscribing) and re-render when the
 * owner recomputes it. `api` is `undefined` while the component is dormant
 * (pre-wake) on the client — parts must guard for it. See PLAN.md, rule R2.
 */
export interface NumberInputApiStore extends ApiStore<UseNumberInputReturn> {}

export const [NumberInputProvider, useNumberInputStore] = createContext<NumberInputApiStore>({
  name: 'ark.number-input',
  hookName: 'useNumberInputContext',
  providerName: '<NumberInput.Root />',
})

export interface UseNumberInputContext extends UseNumberInputReturn {}

export const useNumberInputContext = (): UseNumberInputReturn | undefined => useNumberInputStore().api
