import { component$ } from '@qwik.dev/core'
import { mergeProps } from '@zag-js/qwik'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSignaturePadContext } from './use-signature-pad-context.ts'

export interface SignaturePadSegmentBaseProps extends PolymorphicProps<'svg'> {}
export interface SignaturePadSegmentProps extends HTMLProps<'svg'>, SignaturePadSegmentBaseProps {}

export const SignaturePadSegment = component$<SignaturePadSegmentProps>((props) => {
  const api = useSignaturePadContext()
  const segmentProps = api ? mergeProps(api.getSegmentProps(), props) : props

  return (
    <ark.svg {...segmentProps}>
      <ark.title>Signature</ark.title>
      {api?.paths.map((path, index) => <ark.path key={index} {...api.getSegmentPathProps({ path })} />)}
      {api?.currentPath ? <ark.path {...api.getSegmentPathProps({ path: api.currentPath })} /> : null}
    </ark.svg>
  )
})
