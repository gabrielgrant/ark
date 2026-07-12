import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useToastContext } from './use-toast-context.ts'

export interface ToastActionTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface ToastActionTriggerProps extends HTMLProps<'button'>, ToastActionTriggerBaseProps {}

export const ToastActionTrigger = component$<ToastActionTriggerProps>((props) => {
  const api = useToastContext()
  const actionTriggerProps = api ? mergeProps(api.getActionTriggerProps(), props) : props

  return (
    <ark.button {...actionTriggerProps}>
      <Slot />
    </ark.button>
  )
})
