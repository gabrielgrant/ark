import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseSliderReturn } from './use-slider.ts'

/**
 * The machine `api` is a bag of non-serializable closures, so it is shared as a
 * `noSerialize` value inside a store created by `<Slider.Root>` (see
 * `useApiStore`). Parts read `store.api` (subscribing) and re-render when the
 * owner recomputes it. `api` is `undefined` while the component is dormant
 * (pre-wake) on the client — parts must guard for it. See PLAN.md, rule R2.
 */
export interface SliderApiStore extends ApiStore<UseSliderReturn> {}

export const [SliderProvider, useSliderStore] = createContext<SliderApiStore>({
  name: 'ark.slider',
  hookName: 'useSliderContext',
  providerName: '<Slider.Root />',
})

export interface UseSliderContext extends UseSliderReturn {}

export const useSliderContext = (): UseSliderReturn | undefined => useSliderStore().api
