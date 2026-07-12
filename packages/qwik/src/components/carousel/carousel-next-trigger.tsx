import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCarouselContext } from './use-carousel-context.ts'

export interface CarouselNextTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface CarouselNextTriggerProps extends HTMLProps<'button'>, CarouselNextTriggerBaseProps {}

export const CarouselNextTrigger = component$<CarouselNextTriggerProps>((props) => {
  const api = useCarouselContext()
  const nextTriggerProps = api ? mergeProps(api.getNextTriggerProps(), props) : props

  return (
    <ark.button {...nextTriggerProps}>
      <Slot />
    </ark.button>
  )
})
