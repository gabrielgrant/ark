import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseCheckboxReturn } from './use-checkbox.ts'

/**
 * The machine `api` is a bag of non-serializable closures, so it is shared as a
 * `noSerialize` value inside a store created by `<Checkbox.Root>` (see
 * `useApiStore`). Parts read `store.api` (subscribing) and re-render when the
 * owner recomputes it. `api` is `undefined` while the component is dormant
 * (pre-wake) on the client — parts must guard for it. See PLAN.md, rule R2.
 */
export interface CheckboxApiStore extends ApiStore<UseCheckboxReturn> {}

export const [CheckboxProvider, useCheckboxStore] = createContext<CheckboxApiStore>({
  name: 'ark.checkbox',
  hookName: 'useCheckboxContext',
  providerName: '<Checkbox.Root />',
})

export interface UseCheckboxContext extends UseCheckboxReturn {}

export const useCheckboxContext = (): UseCheckboxReturn | undefined => useCheckboxStore().api
