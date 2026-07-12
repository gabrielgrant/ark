import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCarouselContext } from './use-carousel-context.ts'

export interface CarouselItemGroupBaseProps extends PolymorphicProps<'div'> {}
export interface CarouselItemGroupProps extends HTMLProps<'div'>, CarouselItemGroupBaseProps {}

export const CarouselItemGroup = component$<CarouselItemGroupProps>((props) => {
  const api = useCarouselContext()
  const itemGroupProps = api ? mergeProps(api.getItemGroupProps(), props) : props

  return (
    <ark.div {...itemGroupProps}>
      <Slot />
    </ark.div>
  )
})
