import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useHoverCardContext } from './use-hover-card-context.ts'

export interface HoverCardArrowBaseProps extends PolymorphicProps<'div'> {}
export interface HoverCardArrowProps extends HTMLProps<'div'>, HoverCardArrowBaseProps {}

export const HoverCardArrow = component$<HoverCardArrowProps>((props) => {
  const api = useHoverCardContext()
  // Style (containing `--arrow-size`/`--arrow-background` custom properties)
  // comes straight from the machine and is passed through mergeProps untouched.
  const arrowProps = api ? mergeProps(api.getArrowProps(), props) : props

  return (
    <ark.div {...arrowProps}>
      <Slot />
    </ark.div>
  )
})
