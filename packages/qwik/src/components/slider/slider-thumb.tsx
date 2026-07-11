import type { ThumbProps } from '@zag-js/slider'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSliderContext } from './use-slider-context.ts'
import { SliderThumbPropsProvider } from './use-slider-thumb-props-context.ts'

const thumbPropKeys = ['index', 'name'] as const

const ownKeySet = new Set<string>(thumbPropKeys)

export interface SliderThumbBaseProps extends ThumbProps, PolymorphicProps<'div'> {}
export interface SliderThumbProps extends HTMLProps<'div'>, SliderThumbBaseProps {}

export const SliderThumb = component$<SliderThumbProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const thumbProps = {} as ThumbProps
  for (const key of thumbPropKeys) {
    if (key in record) (thumbProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useSliderContext()

  SliderThumbPropsProvider(thumbProps)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const thumbElProps = api ? mergeProps(api.getThumbProps(thumbProps), rest) : rest

  return (
    <ark.div {...thumbElProps}>
      <Slot />
    </ark.div>
  )
})
