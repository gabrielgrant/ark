import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useToastContext } from './use-toast-context.ts'

export interface ToastDescriptionBaseProps extends PolymorphicProps<'div'> {}
export interface ToastDescriptionProps extends HTMLProps<'div'>, ToastDescriptionBaseProps {}

export const ToastDescription = component$<ToastDescriptionProps>((props) => {
  const api = useToastContext()
  const descriptionProps = api ? mergeProps(api.getDescriptionProps(), props) : props

  return (
    <ark.div {...descriptionProps}>
      <Slot />
    </ark.div>
  )
})
