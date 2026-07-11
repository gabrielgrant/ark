import type { MarkerProps } from '@zag-js/slider'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSliderContext } from './use-slider-context.ts'

const markerPropKeys = ['value'] as const

const ownKeySet = new Set<string>(markerPropKeys)

export interface SliderMarkerBaseProps extends MarkerProps, PolymorphicProps<'span'> {}
export interface SliderMarkerProps extends HTMLProps<'span'>, SliderMarkerBaseProps {}

export const SliderMarker = component$<SliderMarkerProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const markerProps = {} as MarkerProps
  for (const key of markerPropKeys) {
    if (key in record) (markerProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useSliderContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const markerSpanProps = api ? mergeProps(api.getMarkerProps(markerProps), rest) : rest

  return (
    <ark.span {...markerSpanProps}>
      <Slot />
    </ark.span>
  )
})
