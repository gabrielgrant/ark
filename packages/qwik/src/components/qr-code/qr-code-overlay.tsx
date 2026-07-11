import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useQrCodeContext } from './use-qr-code-context.ts'

export interface QrCodeOverlayBaseProps extends PolymorphicProps<'div'> {}
export interface QrCodeOverlayProps extends HTMLProps<'div'>, QrCodeOverlayBaseProps {}

export const QrCodeOverlay = component$<QrCodeOverlayProps>((props) => {
  const api = useQrCodeContext()
  const overlayProps = api ? mergeProps(api.getOverlayProps(), props) : props

  return (
    <ark.div {...overlayProps}>
      <Slot />
    </ark.div>
  )
})
