import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCarouselContext } from './use-carousel-context.ts'

export interface CarouselAutoplayTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface CarouselAutoplayTriggerProps extends HTMLProps<'button'>, CarouselAutoplayTriggerBaseProps {}

export const CarouselAutoplayTrigger = component$<CarouselAutoplayTriggerProps>((props) => {
  const api = useCarouselContext()
  const autoplayTriggerProps = api ? mergeProps(api.getAutoplayTriggerProps(), props) : props

  return (
    <ark.button {...autoplayTriggerProps}>
      <Slot />
    </ark.button>
  )
})
