import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSignaturePadContext } from './use-signature-pad-context.ts'

export interface SignaturePadLabelBaseProps extends PolymorphicProps<'label'> {}
export interface SignaturePadLabelProps extends HTMLProps<'label'>, SignaturePadLabelBaseProps {}

export const SignaturePadLabel = component$<SignaturePadLabelProps>((props) => {
  const api = useSignaturePadContext()
  const labelProps = api ? mergeProps(api.getLabelProps(), props) : props

  return (
    <ark.label {...labelProps}>
      <Slot />
    </ark.label>
  )
})
