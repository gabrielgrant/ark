import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useToastContext } from './use-toast-context.ts'

export interface ToastTitleBaseProps extends PolymorphicProps<'div'> {}
export interface ToastTitleProps extends HTMLProps<'div'>, ToastTitleBaseProps {}

export const ToastTitle = component$<ToastTitleProps>((props) => {
  const api = useToastContext()
  const titleProps = api ? mergeProps(api.getTitleProps(), props) : props

  return (
    <ark.div {...titleProps}>
      <Slot />
    </ark.div>
  )
})
