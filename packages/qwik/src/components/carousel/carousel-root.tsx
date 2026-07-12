import { mergeProps } from '@zag-js/qwik'
import type { AutoplayStatusDetails, DragStatusDetails, PageChangeDetails } from '@zag-js/carousel'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { CarouselProvider } from './use-carousel-context.ts'
import { type UseCarouselProps, useCarousel } from './use-carousel.ts'

const machinePropKeys = [
  'allowMouseDrag',
  'autoplay',
  'autoSize',
  'defaultPage',
  'id',
  'ids',
  'inViewThreshold',
  'loop',
  'orientation',
  'padding',
  'page',
  'slideCount',
  'slidesPerMove',
  'slidesPerPage',
  'snapType',
  'spacing',
  'translations',
] as const

const ownKeySet = new Set<string>([
  ...machinePropKeys,
  'onAutoplayStatusChange$',
  'onDragStatusChange$',
  'onPageChange$',
])

export interface CarouselRootBaseProps extends UseCarouselProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onPageChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onPageChange$?: QRL<(details: PageChangeDetails) => void>
  /** QRL variant of `onDragStatusChange`. */
  onDragStatusChange$?: QRL<(details: DragStatusDetails) => void>
  /** QRL variant of `onAutoplayStatusChange`. */
  onAutoplayStatusChange$?: QRL<(details: AutoplayStatusDetails) => void>
}
export interface CarouselRootProps extends Assign<HTMLProps<'div'>, CarouselRootBaseProps> {}

export const CarouselRoot = component$<CarouselRootProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const api = useCarousel(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainPage = record.onPageChange as ((details: PageChangeDetails) => void) | undefined
    const qrlPage = record.onPageChange$ as QRL<(details: PageChangeDetails) => void> | undefined
    if (plainPage || qrlPage) {
      machineProps.onPageChange = (details: PageChangeDetails) => {
        plainPage?.(details)
        void qrlPage?.(details)
      }
    }

    const plainDrag = record.onDragStatusChange as ((details: DragStatusDetails) => void) | undefined
    const qrlDrag = record.onDragStatusChange$ as QRL<(details: DragStatusDetails) => void> | undefined
    if (plainDrag || qrlDrag) {
      machineProps.onDragStatusChange = (details: DragStatusDetails) => {
        plainDrag?.(details)
        void qrlDrag?.(details)
      }
    }

    const plainAutoplay = record.onAutoplayStatusChange as ((details: AutoplayStatusDetails) => void) | undefined
    const qrlAutoplay = record.onAutoplayStatusChange$ as QRL<(details: AutoplayStatusDetails) => void> | undefined
    if (plainAutoplay || qrlAutoplay) {
      machineProps.onAutoplayStatusChange = (details: AutoplayStatusDetails) => {
        plainAutoplay?.(details)
        void qrlAutoplay?.(details)
      }
    }

    return machineProps as UseCarouselProps
  })

  const store = useApiStore(api)
  CarouselProvider(store)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const rootProps = mergeProps(api.getRootProps(), rest)

  return (
    <ark.div {...rootProps}>
      <Slot />
    </ark.div>
  )
})
