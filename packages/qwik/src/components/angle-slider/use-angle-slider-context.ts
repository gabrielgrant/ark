import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseAngleSliderReturn } from './use-angle-slider.ts'

/**
 * The machine `api` is a bag of non-serializable closures, so it is shared as a
 * `noSerialize` value inside a store created by `<AngleSlider.Root>` (see
 * `useApiStore`). Parts read `store.api` (subscribing) and re-render when the
 * owner recomputes it. `api` is `undefined` while the component is dormant
 * (pre-wake) on the client — parts must guard for it. See PLAN.md, rule R2.
 */
export interface AngleSliderApiStore extends ApiStore<UseAngleSliderReturn> {}

export const [AngleSliderProvider, useAngleSliderStore] = createContext<AngleSliderApiStore>({
  name: 'ark.angle-slider',
  hookName: 'useAngleSliderContext',
  providerName: '<AngleSlider.Root />',
})

export interface UseAngleSliderContext extends UseAngleSliderReturn {}

export const useAngleSliderContext = (): UseAngleSliderReturn | undefined => useAngleSliderStore().api
