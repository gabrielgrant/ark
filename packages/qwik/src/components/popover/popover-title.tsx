import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePopoverContext } from './use-popover-context.ts'

export interface PopoverTitleBaseProps extends PolymorphicProps<'div'> {}
export interface PopoverTitleProps extends HTMLProps<'div'>, PopoverTitleBaseProps {}

export const PopoverTitle = component$<PopoverTitleProps>((props) => {
  const api = usePopoverContext()
  const titleProps = api ? mergeProps(api.getTitleProps(), props) : props

  return (
    <ark.div {...titleProps}>
      <Slot />
    </ark.div>
  )
})
