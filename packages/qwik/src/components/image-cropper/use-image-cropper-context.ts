import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseImageCropperReturn } from './use-image-cropper.ts'

export interface ImageCropperApiStore extends ApiStore<UseImageCropperReturn> {}

export const [ImageCropperProvider, useImageCropperStore] = createContext<ImageCropperApiStore>({
  name: 'ark.image-cropper',
  hookName: 'useImageCropperContext',
  providerName: '<ImageCropper.Root />',
})

export interface UseImageCropperContext extends UseImageCropperReturn {}

export const useImageCropperContext = (): UseImageCropperReturn | undefined => useImageCropperStore().api
