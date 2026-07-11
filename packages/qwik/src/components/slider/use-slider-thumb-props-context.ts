import type { ThumbProps } from '@zag-js/slider'
import { createContext } from '../../utils/create-context.ts'

/**
 * Internal context carrying the static `{ index, name }` a `<Slider.Thumb>`
 * was given, so its children (`HiddenInput`/`DraggingIndicator`) can call the
 * main api's `getXProps(thumbProps)` without threading the index manually.
 * Not exported from the public `index.ts` (mirrors solid/react).
 */
export const [SliderThumbPropsProvider, useSliderThumbPropsContext] = createContext<ThumbProps>({
  name: 'ark.slider-thumb-props',
  hookName: 'useSliderThumbPropsContext',
  providerName: '<Slider.Thumb />',
})
