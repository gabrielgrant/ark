import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePopoverContext } from './use-popover-context.ts'

export interface PopoverDescriptionBaseProps extends PolymorphicProps<'div'> {}
export interface PopoverDescriptionProps extends HTMLProps<'div'>, PopoverDescriptionBaseProps {}

export const PopoverDescription = component$<PopoverDescriptionProps>((props) => {
  const api = usePopoverContext()
  const descriptionProps = api ? mergeProps(api.getDescriptionProps(), props) : props

  return (
    <ark.div {...descriptionProps}>
      <Slot />
    </ark.div>
  )
})
