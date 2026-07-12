import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTourContext } from './use-tour-context.ts'

export interface TourTitleBaseProps extends PolymorphicProps<'h2'> {}
export interface TourTitleProps extends HTMLProps<'h2'>, TourTitleBaseProps {}

export const TourTitle = component$<TourTitleProps>((props) => {
  const api = useTourContext()
  const titleProps = api ? mergeProps(api.getTitleProps(), props) : props

  // rule R13: render the machine-derived fallback as a sibling of an
  // always-claimed empty Slot, never as the Slot's fallback content.
  return (
    <ark.h2 {...titleProps}>
      {api?.step?.title}
      <Slot />
    </ark.h2>
  )
})
