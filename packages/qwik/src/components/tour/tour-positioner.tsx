import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresenceContext } from '../presence/index.ts'
import { useTourContext } from './use-tour-context.ts'

export interface TourPositionerBaseProps extends PolymorphicProps<'div'> {}
export interface TourPositionerProps extends HTMLProps<'div'>, TourPositionerBaseProps {}

export const TourPositioner = component$<TourPositionerProps>((props) => {
  const api = useTourContext()
  const presence = usePresenceContext()

  if (presence?.unmounted) return null

  const positionerProps = api ? mergeProps(api.getPositionerProps(), props) : props

  return (
    <ark.div {...positionerProps}>
      <Slot />
    </ark.div>
  )
})
