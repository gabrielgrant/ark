import type { ValueChangeDetails } from '@zag-js/qr-code'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { QrCodeProvider } from './use-qr-code-context.ts'
import { type UseQrCodeProps, useQrCode } from './use-qr-code.ts'

const machinePropKeys = ['defaultValue', 'encoding', 'id', 'ids', 'onValueChange', 'pixelSize', 'value'] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onValueChange$'])

export interface QrCodeRootBaseProps extends UseQrCodeProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onValueChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onValueChange$?: QRL<(details: ValueChangeDetails) => void>
}
export interface QrCodeRootProps extends Assign<HTMLProps<'div'>, QrCodeRootBaseProps> {}

export const QrCodeRoot = component$<QrCodeRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useQrCode(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }
    const plain = record.onValueChange as ((details: ValueChangeDetails) => void) | undefined
    const qrl = record.onValueChange$ as QRL<(details: ValueChangeDetails) => void> | undefined
    if (plain || qrl) {
      machineProps.onValueChange = (details: ValueChangeDetails) => {
        plain?.(details)
        void qrl?.(details)
      }
    }
    return machineProps as UseQrCodeProps
  })

  const store = useApiStore(api)
  QrCodeProvider(store)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const rootProps = mergeProps(api.getRootProps(), rest)

  return (
    <ark.div {...rootProps}>
      <Slot />
    </ark.div>
  )
})
