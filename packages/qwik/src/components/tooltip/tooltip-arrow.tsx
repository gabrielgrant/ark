import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTooltipContext } from './use-tooltip-context.ts'

export interface TooltipArrowBaseProps extends PolymorphicProps<'div'> {}
export interface TooltipArrowProps extends HTMLProps<'div'>, TooltipArrowBaseProps {}

export const TooltipArrow = component$<TooltipArrowProps>((props) => {
  const api = useTooltipContext()
  // Style (containing `--arrow-size`/`--arrow-background` custom properties)
  // comes straight from the machine and is passed through mergeProps untouched.
  const arrowProps = api ? mergeProps(api.getArrowProps(), props) : props

  return (
    <ark.div {...arrowProps}>
      <Slot />
    </ark.div>
  )
})
