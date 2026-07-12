import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseCarouselReturn } from './use-carousel.ts'

export interface CarouselApiStore extends ApiStore<UseCarouselReturn> {}

export const [CarouselProvider, useCarouselStore] = createContext<CarouselApiStore>({
  name: 'ark.carousel',
  hookName: 'useCarouselContext',
  providerName: '<Carousel.Root />',
})

export interface UseCarouselContext extends UseCarouselReturn {}

export const useCarouselContext = (): UseCarouselReturn | undefined => useCarouselStore().api
