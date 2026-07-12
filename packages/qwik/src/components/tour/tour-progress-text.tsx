import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTourContext } from './use-tour-context.ts'

export interface TourProgressTextBaseProps extends PolymorphicProps<'div'> {}
export interface TourProgressTextProps extends HTMLProps<'div'>, TourProgressTextBaseProps {}

export const TourProgressText = component$<TourProgressTextProps>((props) => {
  const api = useTourContext()
  const progressTextProps = api ? mergeProps(api.getProgressTextProps(), props) : props

  // rule R13: `getProgressText()` is a function-call result (fresh value, not
  // a proxied deep read) — safe to call directly, still rendered as a
  // sibling of an always-claimed empty Slot per the same convention.
  return (
    <ark.div {...progressTextProps}>
      {api?.getProgressText()}
      <Slot />
    </ark.div>
  )
})
