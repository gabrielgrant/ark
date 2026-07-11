import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useHoverCardContext } from './use-hover-card-context.ts'

export interface HoverCardArrowTipBaseProps extends PolymorphicProps<'div'> {}
export interface HoverCardArrowTipProps extends HTMLProps<'div'>, HoverCardArrowTipBaseProps {}

export const HoverCardArrowTip = component$<HoverCardArrowTipProps>((props) => {
  const api = useHoverCardContext()
  const arrowTipProps = api ? mergeProps(api.getArrowTipProps(), props) : props

  return <ark.div {...arrowTipProps} />
})
