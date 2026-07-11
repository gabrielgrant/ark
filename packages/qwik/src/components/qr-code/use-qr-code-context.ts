import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseQrCodeReturn } from './use-qr-code.ts'

/**
 * The machine `api` is a bag of non-serializable closures, so it is shared as a
 * `noSerialize` value inside a store created by `<QrCode.Root>` (see
 * `useApiStore`). Parts read `store.api` (subscribing) and re-render when the
 * owner recomputes it. `api` is `undefined` while the component is dormant
 * (pre-wake) on the client — parts must guard for it. See PLAN.md, rule R2.
 */
export interface QrCodeApiStore extends ApiStore<UseQrCodeReturn> {}

export const [QrCodeProvider, useQrCodeStore] = createContext<QrCodeApiStore>({
  name: 'ark.qr-code',
  hookName: 'useQrCodeContext',
  providerName: '<QrCode.Root />',
})

export interface UseQrCodeContext extends UseQrCodeReturn {}

export const useQrCodeContext = (): UseQrCodeReturn | undefined => useQrCodeStore().api
