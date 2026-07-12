import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSignaturePadContext } from './use-signature-pad-context.ts'

export interface SignaturePadClearTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface SignaturePadClearTriggerProps extends HTMLProps<'button'>, SignaturePadClearTriggerBaseProps {}

export const SignaturePadClearTrigger = component$<SignaturePadClearTriggerProps>((props) => {
  const api = useSignaturePadContext()
  const clearTriggerProps = api ? mergeProps(api.getClearTriggerProps(), props) : props

  return (
    <ark.button {...clearTriggerProps}>
      <Slot />
    </ark.button>
  )
})
