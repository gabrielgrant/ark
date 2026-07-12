import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTourContext } from './use-tour-context.ts'

export interface TourDescriptionBaseProps extends PolymorphicProps<'div'> {}
export interface TourDescriptionProps extends HTMLProps<'div'>, TourDescriptionBaseProps {}

export const TourDescription = component$<TourDescriptionProps>((props) => {
  const api = useTourContext()
  const descriptionProps = api ? mergeProps(api.getDescriptionProps(), props) : props

  // rule R13: sibling of an always-claimed empty Slot, not a Slot fallback.
  return (
    <ark.div {...descriptionProps}>
      {api?.step?.description}
      <Slot />
    </ark.div>
  )
})
