import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseSplitterReturn } from './use-splitter.ts'

/**
 * The machine `api` is a bag of non-serializable closures, so it is shared as a
 * `noSerialize` value inside a store created by `<Splitter.Root>` (see
 * `useApiStore`). Parts read `store.api` (subscribing) and re-render when the
 * owner recomputes it. `api` is `undefined` while the component is dormant
 * (pre-wake) on the client — parts must guard for it. See PLAN.md, rule R2.
 */
export interface SplitterApiStore extends ApiStore<UseSplitterReturn> {}

export const [SplitterProvider, useSplitterStore] = createContext<SplitterApiStore>({
  name: 'ark.splitter',
  hookName: 'useSplitterContext',
  providerName: '<Splitter.Root />',
})

export interface UseSplitterContext extends UseSplitterReturn {}

export const useSplitterContext = (): UseSplitterReturn | undefined => useSplitterStore().api
