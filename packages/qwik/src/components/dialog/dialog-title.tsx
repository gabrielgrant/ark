import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDialogContext } from './use-dialog-context.ts'

export interface DialogTitleBaseProps extends PolymorphicProps<'h2'> {}
export interface DialogTitleProps extends HTMLProps<'h2'>, DialogTitleBaseProps {}

export const DialogTitle = component$<DialogTitleProps>((props) => {
  const api = useDialogContext()
  const titleProps = api ? mergeProps(api.getTitleProps(), props) : props

  return (
    <ark.h2 {...titleProps}>
      <Slot />
    </ark.h2>
  )
})
