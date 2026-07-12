import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCarouselContext } from './use-carousel-context.ts'

export interface CarouselIndicatorGroupBaseProps extends PolymorphicProps<'div'> {}
export interface CarouselIndicatorGroupProps extends HTMLProps<'div'>, CarouselIndicatorGroupBaseProps {}

export const CarouselIndicatorGroup = component$<CarouselIndicatorGroupProps>((props) => {
  const api = useCarouselContext()
  const indicatorGroupProps = api ? mergeProps(api.getIndicatorGroupProps(), props) : props

  return (
    <ark.div {...indicatorGroupProps}>
      <Slot />
    </ark.div>
  )
})
