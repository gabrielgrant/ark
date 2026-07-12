import { mergeProps } from '@zag-js/qwik'
import type { PauseStatusDetails } from '@zag-js/marquee'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { MarqueeProvider } from './use-marquee-context.ts'
import { type UseMarqueeProps, useMarquee } from './use-marquee.ts'

const machinePropKeys = [
  'autoFill',
  'defaultPaused',
  'delay',
  'id',
  'ids',
  'loopCount',
  'paused',
  'pauseOnInteraction',
  'reverse',
  'side',
  'spacing',
  'speed',
  'translations',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onComplete$', 'onLoopComplete$', 'onPauseChange$'])

export interface MarqueeRootBaseProps extends UseMarqueeProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onPauseChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onPauseChange$?: QRL<(details: PauseStatusDetails) => void>
  /** QRL variant of `onLoopComplete`. */
  onLoopComplete$?: QRL<() => void>
  /** QRL variant of `onComplete`. */
  onComplete$?: QRL<() => void>
}
export interface MarqueeRootProps extends Assign<HTMLProps<'div'>, MarqueeRootBaseProps> {}

export const MarqueeRoot = component$<MarqueeRootProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const api = useMarquee(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainPause = record.onPauseChange as ((details: PauseStatusDetails) => void) | undefined
    const qrlPause = record.onPauseChange$ as QRL<(details: PauseStatusDetails) => void> | undefined
    if (plainPause || qrlPause) {
      machineProps.onPauseChange = (details: PauseStatusDetails) => {
        plainPause?.(details)
        void qrlPause?.(details)
      }
    }

    const plainLoop = record.onLoopComplete as (() => void) | undefined
    const qrlLoop = record.onLoopComplete$ as QRL<() => void> | undefined
    if (plainLoop || qrlLoop) {
      machineProps.onLoopComplete = () => {
        plainLoop?.()
        void qrlLoop?.()
      }
    }

    const plainComplete = record.onComplete as (() => void) | undefined
    const qrlComplete = record.onComplete$ as QRL<() => void> | undefined
    if (plainComplete || qrlComplete) {
      machineProps.onComplete = () => {
        plainComplete?.()
        void qrlComplete?.()
      }
    }

    return machineProps as UseMarqueeProps
  })

  const store = useApiStore(api)
  MarqueeProvider(store)

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
