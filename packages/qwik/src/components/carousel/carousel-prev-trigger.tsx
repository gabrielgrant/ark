import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCarouselContext } from './use-carousel-context.ts'

export interface CarouselPrevTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface CarouselPrevTriggerProps extends HTMLProps<'button'>, CarouselPrevTriggerBaseProps {}

export const CarouselPrevTrigger = component$<CarouselPrevTriggerProps>((props) => {
  const api = useCarouselContext()
  const prevTriggerProps = api ? mergeProps(api.getPrevTriggerProps(), props) : props

  return (
    <ark.button {...prevTriggerProps}>
      <Slot />
    </ark.button>
  )
})
