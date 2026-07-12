import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { carouselAnatomy } from './carousel.anatomy.ts'
import { useCarouselContext } from './use-carousel-context.ts'

const parts = carouselAnatomy.build()

export interface CarouselProgressTextBaseProps extends PolymorphicProps<'span'> {}
export interface CarouselProgressTextProps extends HTMLProps<'span'>, CarouselProgressTextBaseProps {}

export const CarouselProgressText = component$<CarouselProgressTextProps>((props) => {
  const api = useCarouselContext()
  const currentPage = (api?.page ?? 0) + 1
  const totalPages = api?.pageSnapPoints.length ?? 0
  const progressText = `${currentPage} / ${totalPages}`
  const hasChildren = props.children != null

  // rule R13: render the derived value as a sibling expression next to an
  // always-claimed Slot rather than as the Slot's fallback content -- a Slot
  // fallback goes stale when it reads a noSerialize store. `hasChildren` is
  // derived from the (stable) `children` prop, not the store, so a plain
  // conditional here is safe (unlike R11's machine-state-driven branching).
  return (
    <ark.span {...parts.progressText.attrs} {...props}>
      {hasChildren ? null : progressText}
      <Slot />
    </ark.span>
  )
})
