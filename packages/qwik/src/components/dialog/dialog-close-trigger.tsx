import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDialogContext } from './use-dialog-context.ts'

export interface DialogCloseTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface DialogCloseTriggerProps extends HTMLProps<'button'>, DialogCloseTriggerBaseProps {}

export const DialogCloseTrigger = component$<DialogCloseTriggerProps>((props) => {
  const api = useDialogContext()
  const closeTriggerProps = api ? mergeProps(api.getCloseTriggerProps(), props) : props

  return (
    <ark.button {...closeTriggerProps}>
      <Slot />
    </ark.button>
  )
})
