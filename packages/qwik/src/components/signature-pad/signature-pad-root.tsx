import { mergeProps } from '@zag-js/qwik'
import type { DrawDetails, DrawEndDetails } from '@zag-js/signature-pad'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { SignaturePadProvider } from './use-signature-pad-context.ts'
import { type UseSignaturePadProps, useSignaturePad } from './use-signature-pad.ts'

const machinePropKeys = [
  'defaultPaths',
  'disabled',
  'drawing',
  'id',
  'ids',
  'name',
  'paths',
  'readOnly',
  'required',
  'translations',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onDraw$', 'onDrawEnd$'])

export interface SignaturePadRootBaseProps extends UseSignaturePadProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onDraw`. Prefer this in Qwik apps: plain function props
   * cannot be serialized when the component is server-rendered.
   */
  onDraw$?: QRL<(details: DrawDetails) => void>
  /** QRL variant of `onDrawEnd`. */
  onDrawEnd$?: QRL<(details: DrawEndDetails) => void>
}
export interface SignaturePadRootProps extends Assign<HTMLProps<'div'>, SignaturePadRootBaseProps> {}

export const SignaturePadRoot = component$<SignaturePadRootProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const api = useSignaturePad(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainDraw = record.onDraw as ((details: DrawDetails) => void) | undefined
    const qrlDraw = record.onDraw$ as QRL<(details: DrawDetails) => void> | undefined
    if (plainDraw || qrlDraw) {
      machineProps.onDraw = (details: DrawDetails) => {
        plainDraw?.(details)
        void qrlDraw?.(details)
      }
    }

    const plainDrawEnd = record.onDrawEnd as ((details: DrawEndDetails) => void) | undefined
    const qrlDrawEnd = record.onDrawEnd$ as QRL<(details: DrawEndDetails) => void> | undefined
    if (plainDrawEnd || qrlDrawEnd) {
      machineProps.onDrawEnd = (details: DrawEndDetails) => {
        plainDrawEnd?.(details)
        void qrlDrawEnd?.(details)
      }
    }

    return machineProps as UseSignaturePadProps
  })

  const store = useApiStore(api)
  SignaturePadProvider(store)

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
