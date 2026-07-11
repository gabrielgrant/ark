import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseClipboardReturn } from './use-clipboard.ts'

/**
 * The machine `api` is a bag of non-serializable closures, so it is shared as a
 * `noSerialize` value inside a store created by `<Clipboard.Root>` (see
 * `useApiStore`). Parts read `store.api` (subscribing) and re-render when the
 * owner recomputes it. `api` is `undefined` while the component is dormant
 * (pre-wake) on the client — parts must guard for it. See PLAN.md, rule R2.
 */
export interface ClipboardApiStore extends ApiStore<UseClipboardReturn> {}

export const [ClipboardProvider, useClipboardStore] = createContext<ClipboardApiStore>({
  name: 'ark.clipboard',
  hookName: 'useClipboardContext',
  providerName: '<Clipboard.Root />',
})

export interface UseClipboardContext extends UseClipboardReturn {}

export const useClipboardContext = (): UseClipboardReturn | undefined => useClipboardStore().api
