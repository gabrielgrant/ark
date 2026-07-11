import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePopoverContext } from './use-popover-context.ts'

export interface PopoverArrowTipBaseProps extends PolymorphicProps<'div'> {}
export interface PopoverArrowTipProps extends HTMLProps<'div'>, PopoverArrowTipBaseProps {}

export const PopoverArrowTip = component$<PopoverArrowTipProps>((props) => {
  const api = usePopoverContext()
  const arrowTipProps = api ? mergeProps(api.getArrowTipProps(), props) : props

  return <ark.div {...arrowTipProps} />
})
