import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSignaturePadContext } from './use-signature-pad-context.ts'

export interface SignaturePadControlBaseProps extends PolymorphicProps<'div'> {}
export interface SignaturePadControlProps extends HTMLProps<'div'>, SignaturePadControlBaseProps {}

export const SignaturePadControl = component$<SignaturePadControlProps>((props) => {
  const api = useSignaturePadContext()
  const controlProps = api ? mergeProps(api.getControlProps(), props) : props

  return (
    <ark.div {...controlProps}>
      <Slot />
    </ark.div>
  )
})
