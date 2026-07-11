import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useQrCodeContext } from './use-qr-code-context.ts'

export interface QrCodePatternBaseProps extends PolymorphicProps<'path'> {}
export interface QrCodePatternProps extends HTMLProps<'path'>, QrCodePatternBaseProps {}

export const QrCodePattern = component$<QrCodePatternProps>((props) => {
  const api = useQrCodeContext()
  const patternProps = api ? mergeProps(api.getPatternProps(), props as Record<string, unknown>) : props

  return <ark.path {...patternProps} />
})
