import type { IndicatorProps } from '@zag-js/carousel'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCarouselContext } from './use-carousel-context.ts'

const indicatorPropKeys = ['index', 'readOnly'] as const

const ownKeySet = new Set<string>(indicatorPropKeys)

export interface CarouselIndicatorBaseProps extends IndicatorProps, PolymorphicProps<'button'> {}
export interface CarouselIndicatorProps extends Assign<HTMLProps<'button'>, CarouselIndicatorBaseProps> {}

export const CarouselIndicator = component$<CarouselIndicatorProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const indicatorProps = {} as IndicatorProps
  for (const key of indicatorPropKeys) {
    if (key in record) (indicatorProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useCarouselContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const indicatorButtonProps = api ? mergeProps(api.getIndicatorProps(indicatorProps), rest) : rest

  return (
    <ark.button {...indicatorButtonProps}>
      <Slot />
    </ark.button>
  )
})
