import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePopoverContext } from './use-popover-context.ts'

export interface PopoverAnchorBaseProps extends PolymorphicProps<'div'> {}
export interface PopoverAnchorProps extends HTMLProps<'div'>, PopoverAnchorBaseProps {}

export const PopoverAnchor = component$<PopoverAnchorProps>((props) => {
  const api = usePopoverContext()
  const anchorProps = api ? mergeProps(api.getAnchorProps(), props) : props

  return (
    <ark.div {...anchorProps}>
      <Slot />
    </ark.div>
  )
})
