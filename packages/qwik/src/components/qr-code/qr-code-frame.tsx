import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useQrCodeContext } from './use-qr-code-context.ts'

export interface QrCodeFrameBaseProps extends PolymorphicProps<'svg'> {}
export interface QrCodeFrameProps extends HTMLProps<'svg'>, QrCodeFrameBaseProps {}

export const QrCodeFrame = component$<QrCodeFrameProps>((props) => {
  const api = useQrCodeContext()
  const frameProps = api ? mergeProps(api.getFrameProps(), props) : props

  return (
    <ark.svg {...frameProps}>
      <Slot />
    </ark.svg>
  )
})
