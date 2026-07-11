import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresenceContext } from '../presence/index.ts'
import { useHoverCardContext } from './use-hover-card-context.ts'

export interface HoverCardPositionerBaseProps extends PolymorphicProps<'div'> {}
export interface HoverCardPositionerProps extends HTMLProps<'div'>, HoverCardPositionerBaseProps {}

export const HoverCardPositioner = component$<HoverCardPositionerProps>((props) => {
  const api = useHoverCardContext()
  const presence = usePresenceContext()

  if (presence?.unmounted) return null

  // Style (containing `--x`/`--y` custom properties) comes straight from the
  // machine's popper positioning and is passed through mergeProps untouched.
  const positionerProps = api ? mergeProps(api.getPositionerProps(), props) : props

  return (
    <ark.div {...positionerProps}>
      <Slot />
    </ark.div>
  )
})
