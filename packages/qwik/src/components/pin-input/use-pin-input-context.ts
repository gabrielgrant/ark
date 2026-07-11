import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UsePinInputReturn } from './use-pin-input.ts'

/**
 * The machine `api` is a bag of non-serializable closures, so it is shared as a
 * `noSerialize` value inside a store created by `<PinInput.Root>` (see
 * `useApiStore`). Parts read `store.api` (subscribing) and re-render when the
 * owner recomputes it. `api` is `undefined` while the component is dormant
 * (pre-wake) on the client — parts must guard for it. See PLAN.md, rule R2.
 */
export interface PinInputApiStore extends ApiStore<UsePinInputReturn> {}

export const [PinInputProvider, usePinInputStore] = createContext<PinInputApiStore>({
  name: 'ark.pin-input',
  hookName: 'usePinInputContext',
  providerName: '<PinInput.Root />',
})

export interface UsePinInputContext extends UsePinInputReturn {}

export const usePinInputContext = (): UsePinInputReturn | undefined => usePinInputStore().api
