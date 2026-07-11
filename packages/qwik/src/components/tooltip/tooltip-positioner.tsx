import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresenceContext } from '../presence/index.ts'
import { useTooltipContext } from './use-tooltip-context.ts'

export interface TooltipPositionerBaseProps extends PolymorphicProps<'div'> {}
export interface TooltipPositionerProps extends HTMLProps<'div'>, TooltipPositionerBaseProps {}

export const TooltipPositioner = component$<TooltipPositionerProps>((props) => {
  const api = useTooltipContext()
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
