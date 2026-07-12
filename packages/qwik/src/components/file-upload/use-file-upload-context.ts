import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseFileUploadReturn } from './use-file-upload.ts'

export interface FileUploadApiStore extends ApiStore<UseFileUploadReturn> {}

export const [FileUploadProvider, useFileUploadStore] = createContext<FileUploadApiStore>({
  name: 'ark.file-upload',
  hookName: 'useFileUploadContext',
  providerName: '<FileUpload.Root />',
})

export interface UseFileUploadContext extends UseFileUploadReturn {}

export const useFileUploadContext = (): UseFileUploadReturn | undefined => useFileUploadStore().api
