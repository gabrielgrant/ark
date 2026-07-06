import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDialogContext } from './use-dialog-context.ts'

export interface DialogDescriptionBaseProps extends PolymorphicProps<'div'> {}
export interface DialogDescriptionProps extends HTMLProps<'div'>, DialogDescriptionBaseProps {}

export const DialogDescription = component$<DialogDescriptionProps>((props) => {
  const api = useDialogContext()
  const descriptionProps = api ? mergeProps(api.getDescriptionProps(), props) : props

  return (
    <ark.div {...descriptionProps}>
      <Slot />
    </ark.div>
  )
})
