import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseDialogReturn } from './use-dialog.ts'

export interface DialogApiStore extends ApiStore<UseDialogReturn> {}

export const [DialogProvider, useDialogStore] = createContext<DialogApiStore>({
  name: 'ark.dialog',
  hookName: 'useDialogContext',
  providerName: '<Dialog.Root />',
})

export interface UseDialogContext extends UseDialogReturn {}

export const useDialogContext = (): UseDialogReturn | undefined => useDialogStore().api
