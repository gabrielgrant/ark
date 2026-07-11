import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePopoverContext } from './use-popover-context.ts'

export interface PopoverArrowBaseProps extends PolymorphicProps<'div'> {}
export interface PopoverArrowProps extends HTMLProps<'div'>, PopoverArrowBaseProps {}

export const PopoverArrow = component$<PopoverArrowProps>((props) => {
  const api = usePopoverContext()
  // Style (containing `--arrow-size`/`--arrow-background` custom properties)
  // comes straight from the machine and is passed through mergeProps untouched.
  const arrowProps = api ? mergeProps(api.getArrowProps(), props) : props

  return (
    <ark.div {...arrowProps}>
      <Slot />
    </ark.div>
  )
})
