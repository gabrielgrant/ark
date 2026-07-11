import type { DownloadTriggerProps } from '@zag-js/qr-code'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useQrCodeContext } from './use-qr-code-context.ts'

const downloadTriggerPropKeys = ['fileName', 'mimeType', 'quality'] as const

const ownKeySet = new Set<string>(downloadTriggerPropKeys)

export interface QrCodeDownloadTriggerBaseProps extends DownloadTriggerProps, PolymorphicProps<'button'> {}
export interface QrCodeDownloadTriggerProps extends Assign<HTMLProps<'button'>, QrCodeDownloadTriggerBaseProps> {}

export const QrCodeDownloadTrigger = component$<QrCodeDownloadTriggerProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const downloadTriggerProps = {} as DownloadTriggerProps
  for (const key of downloadTriggerPropKeys) {
    if (key in record) (downloadTriggerProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useQrCodeContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const triggerProps = api ? mergeProps(api.getDownloadTriggerProps(downloadTriggerProps), rest) : rest

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
