import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseFloatingPanelReturn } from './use-floating-panel.ts'

/**
 * The machine `api` is a bag of non-serializable closures, so it is shared as a
 * `noSerialize` value inside a store created by `<FloatingPanel.Root>` (see
 * `useApiStore`). Parts read `store.api` (subscribing) and re-render when the
 * owner recomputes it. `api` is `undefined` while the component is dormant
 * (pre-wake) on the client — parts must guard for it. See PLAN.md, rule R2.
 */
export interface FloatingPanelApiStore extends ApiStore<UseFloatingPanelReturn> {}

export const [FloatingPanelProvider, useFloatingPanelStore] = createContext<FloatingPanelApiStore>({
  name: 'ark.floating-panel',
  hookName: 'useFloatingPanelContext',
  providerName: '<FloatingPanel.Root />',
})

export interface UseFloatingPanelContext extends UseFloatingPanelReturn {}

export const useFloatingPanelContext = (): UseFloatingPanelReturn | undefined => useFloatingPanelStore().api
