import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTooltipContext } from './use-tooltip-context.ts'

export interface TooltipArrowTipBaseProps extends PolymorphicProps<'div'> {}
export interface TooltipArrowTipProps extends HTMLProps<'div'>, TooltipArrowTipBaseProps {}

export const TooltipArrowTip = component$<TooltipArrowTipProps>((props) => {
  const api = useTooltipContext()
  const arrowTipProps = api ? mergeProps(api.getArrowTipProps(), props) : props

  return <ark.div {...arrowTipProps} />
})
