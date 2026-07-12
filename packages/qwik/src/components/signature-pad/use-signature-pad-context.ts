import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseSignaturePadReturn } from './use-signature-pad.ts'

export interface SignaturePadApiStore extends ApiStore<UseSignaturePadReturn> {}

export const [SignaturePadProvider, useSignaturePadStore] = createContext<SignaturePadApiStore>({
  name: 'ark.signature-pad',
  hookName: 'useSignaturePadContext',
  providerName: '<SignaturePad.Root />',
})

export interface UseSignaturePadContext extends UseSignaturePadReturn {}

export const useSignaturePadContext = (): UseSignaturePadReturn | undefined => useSignaturePadStore().api
