import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseEditableReturn } from './use-editable.ts'

/**
 * The machine `api` is a bag of non-serializable closures, so it is shared as a
 * `noSerialize` value inside a store created by `<Editable.Root>` (see
 * `useApiStore`). Parts read `store.api` (subscribing) and re-render when the
 * owner recomputes it. `api` is `undefined` while the component is dormant
 * (pre-wake) on the client — parts must guard for it. See PLAN.md, rule R2.
 */
export interface EditableApiStore extends ApiStore<UseEditableReturn> {}

export const [EditableProvider, useEditableStore] = createContext<EditableApiStore>({
  name: 'ark.editable',
  hookName: 'useEditableContext',
  providerName: '<Editable.Root />',
})

export interface UseEditableContext extends UseEditableReturn {}

export const useEditableContext = (): UseEditableReturn | undefined => useEditableStore().api
