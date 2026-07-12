import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSignaturePadContext } from './use-signature-pad-context.ts'

export interface SignaturePadGuideBaseProps extends PolymorphicProps<'div'> {}
export interface SignaturePadGuideProps extends HTMLProps<'div'>, SignaturePadGuideBaseProps {}

export const SignaturePadGuide = component$<SignaturePadGuideProps>((props) => {
  const api = useSignaturePadContext()
  const guideProps = api ? mergeProps(api.getGuideProps(), props) : props

  return (
    <ark.div {...guideProps}>
      <Slot />
    </ark.div>
  )
})
