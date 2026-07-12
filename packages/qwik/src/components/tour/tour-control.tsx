import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { tourAnatomy } from './tour.anatomy.ts'

export interface TourControlBaseProps extends PolymorphicProps<'div'> {}
export interface TourControlProps extends HTMLProps<'div'>, TourControlBaseProps {}

const controlAttrs = tourAnatomy.build().control.attrs as Record<string, string>

export const TourControl = component$<TourControlProps>((props) => {
  return (
    <ark.div {...controlAttrs} {...props}>
      <Slot />
    </ark.div>
  )
})
