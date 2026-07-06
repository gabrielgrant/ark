import type { NoSerialize } from '@qwik.dev/core'
import { createContext } from '../../utils/create-context.ts'
import type { UseCheckboxReturn } from './use-checkbox.ts'

/**
 * The machine `api` is a bag of non-serializable closures, so it is shared as a
 * `noSerialize` value inside a store created by `<Checkbox.Root>`. Parts read
 * `store.api` (subscribing to it) and re-render when the owner re-computes it on
 * activation/resume. `api` is `undefined` while the component is dormant
 * (pre-wake) on the client — parts must guard for it. See PLAN.md §2.
 */
export interface CheckboxApiStore {
  api: NoSerialize<UseCheckboxReturn> | undefined
}

export const [CheckboxProvider, useCheckboxStore] = createContext<CheckboxApiStore>({
  name: 'ark.checkbox',
  hookName: 'useCheckboxContext',
  providerName: '<Checkbox.Root />',
})

export interface UseCheckboxContext extends UseCheckboxReturn {}

export const useCheckboxContext = (): UseCheckboxReturn | undefined => useCheckboxStore().api
