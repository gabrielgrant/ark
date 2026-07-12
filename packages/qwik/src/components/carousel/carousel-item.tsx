import type { ItemProps } from '@zag-js/carousel'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCarouselContext } from './use-carousel-context.ts'

const itemPropKeys = ['index', 'snapAlign'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface CarouselItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface CarouselItemProps extends Assign<HTMLProps<'div'>, CarouselItemBaseProps> {}

export const CarouselItem = component$<CarouselItemProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const itemProps = {} as ItemProps
  for (const key of itemPropKeys) {
    if (key in record) (itemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useCarouselContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const itemDivProps = api ? mergeProps(api.getItemProps(itemProps), rest) : rest

  return (
    <ark.div {...itemDivProps}>
      <Slot />
    </ark.div>
  )
})
