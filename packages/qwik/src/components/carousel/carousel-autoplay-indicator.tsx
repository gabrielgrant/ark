import { type JSXOutput, Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { carouselAnatomy } from './carousel.anatomy.ts'
import { useCarouselContext } from './use-carousel-context.ts'

const parts = carouselAnatomy.build()

export interface CarouselAutoplayIndicatorBaseProps extends PolymorphicProps<'span'> {
  /**
   * The fallback content to render when autoplay is paused.
   */
  fallback?: JSXOutput
}
export interface CarouselAutoplayIndicatorProps extends HTMLProps<'span'>, CarouselAutoplayIndicatorBaseProps {}

/**
 * The projected (default-slot) content is toggled via the `hidden` attribute
 * rather than branched with `condition ? <Slot/> : fallback` — an unclaimed
 * `<Slot/>` leaves a `<q:template>` marker that trips Qwik's SSR content-model
 * check (R11). See `ClipboardIndicator` for the same fix.
 */
export const CarouselAutoplayIndicator = component$<CarouselAutoplayIndicatorProps>((props) => {
  const record = props as unknown as Record<string, unknown>
  const fallbackContent = record.fallback as JSXOutput | undefined

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (key !== 'fallback') rest[key] = record[key]
  }

  const api = useCarouselContext()
  const isPlaying = !!api?.isPlaying

  return (
    <ark.span {...parts.autoplayIndicator.attrs} {...rest}>
      <span hidden={!isPlaying}>
        <Slot />
      </span>
      {!isPlaying ? fallbackContent : null}
    </ark.span>
  )
})
