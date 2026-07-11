import type { MarkerProps } from '@zag-js/angle-slider'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useAngleSliderContext } from './use-angle-slider-context.ts'

const markerPropKeys = ['value'] as const

const ownKeySet = new Set<string>(markerPropKeys)

export interface AngleSliderMarkerBaseProps extends PolymorphicProps<'div'>, MarkerProps {}
export interface AngleSliderMarkerProps extends HTMLProps<'div'>, AngleSliderMarkerBaseProps {}

export const AngleSliderMarker = component$<AngleSliderMarkerProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const markerProps = {} as MarkerProps
  for (const key of markerPropKeys) {
    if (key in record) (markerProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useAngleSliderContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const markerElProps = api ? mergeProps(api.getMarkerProps(markerProps), rest) : rest

  return (
    <ark.div {...markerElProps}>
      <Slot />
    </ark.div>
  )
})
