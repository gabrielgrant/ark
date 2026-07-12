import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseMarqueeReturn } from './use-marquee.ts'

export interface MarqueeApiStore extends ApiStore<UseMarqueeReturn> {}

export const [MarqueeProvider, useMarqueeStore] = createContext<MarqueeApiStore>({
  name: 'ark.marquee',
  hookName: 'useMarqueeContext',
  providerName: '<Marquee.Root />',
})

export interface UseMarqueeContext extends UseMarqueeReturn {}

export const useMarqueeContext = (): UseMarqueeReturn | undefined => useMarqueeStore().api
