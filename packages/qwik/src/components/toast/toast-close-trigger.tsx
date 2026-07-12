import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useToastContext } from './use-toast-context.ts'

export interface ToastCloseTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface ToastCloseTriggerProps extends HTMLProps<'button'>, ToastCloseTriggerBaseProps {}

export const ToastCloseTrigger = component$<ToastCloseTriggerProps>((props) => {
  const api = useToastContext()
  const closeTriggerProps = api ? mergeProps(api.getCloseTriggerProps(), props) : props

  return (
    <ark.button {...closeTriggerProps}>
      <Slot />
    </ark.button>
  )
})
