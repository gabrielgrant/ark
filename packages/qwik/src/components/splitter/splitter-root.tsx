import type { ExpandCollapseDetails, ResizeDetails, ResizeEndDetails } from '@zag-js/splitter'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { SplitterProvider } from './use-splitter-context.ts'
import { type UseSplitterProps, useSplitter } from './use-splitter.ts'

const machinePropKeys = [
  'defaultSize',
  'id',
  'ids',
  'keyboardResizeBy',
  'nonce',
  'onCollapse',
  'onExpand',
  'onResize',
  'onResizeEnd',
  'onResizeStart',
  'orientation',
  'panels',
  'registry',
  'size',
] as const

const ownKeySet = new Set<string>([
  ...machinePropKeys,
  'onCollapse$',
  'onExpand$',
  'onResize$',
  'onResizeEnd$',
  'onResizeStart$',
])

export interface SplitterRootBaseProps extends UseSplitterProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onCollapse`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onCollapse$?: QRL<(details: ExpandCollapseDetails) => void>
  /**
   * QRL variant of `onExpand`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onExpand$?: QRL<(details: ExpandCollapseDetails) => void>
  /**
   * QRL variant of `onResize`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onResize$?: QRL<(details: ResizeDetails) => void>
  /**
   * QRL variant of `onResizeEnd`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onResizeEnd$?: QRL<(details: ResizeEndDetails) => void>
  /**
   * QRL variant of `onResizeStart`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onResizeStart$?: QRL<() => void>
}
export interface SplitterRootProps extends Assign<HTMLProps<'div'>, SplitterRootBaseProps> {}

export const SplitterRoot = component$<SplitterRootProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const api = useSplitter(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainCollapse = record.onCollapse as ((details: ExpandCollapseDetails) => void) | undefined
    const qrlCollapse = record.onCollapse$ as QRL<(details: ExpandCollapseDetails) => void> | undefined
    if (plainCollapse || qrlCollapse) {
      machineProps.onCollapse = (details: ExpandCollapseDetails) => {
        plainCollapse?.(details)
        void qrlCollapse?.(details)
      }
    }

    const plainExpand = record.onExpand as ((details: ExpandCollapseDetails) => void) | undefined
    const qrlExpand = record.onExpand$ as QRL<(details: ExpandCollapseDetails) => void> | undefined
    if (plainExpand || qrlExpand) {
      machineProps.onExpand = (details: ExpandCollapseDetails) => {
        plainExpand?.(details)
        void qrlExpand?.(details)
      }
    }

    const plainResize = record.onResize as ((details: ResizeDetails) => void) | undefined
    const qrlResize = record.onResize$ as QRL<(details: ResizeDetails) => void> | undefined
    if (plainResize || qrlResize) {
      machineProps.onResize = (details: ResizeDetails) => {
        plainResize?.(details)
        void qrlResize?.(details)
      }
    }

    const plainResizeEnd = record.onResizeEnd as ((details: ResizeEndDetails) => void) | undefined
    const qrlResizeEnd = record.onResizeEnd$ as QRL<(details: ResizeEndDetails) => void> | undefined
    if (plainResizeEnd || qrlResizeEnd) {
      machineProps.onResizeEnd = (details: ResizeEndDetails) => {
        plainResizeEnd?.(details)
        void qrlResizeEnd?.(details)
      }
    }

    const plainResizeStart = record.onResizeStart as (() => void) | undefined
    const qrlResizeStart = record.onResizeStart$ as QRL<() => void> | undefined
    if (plainResizeStart || qrlResizeStart) {
      machineProps.onResizeStart = () => {
        plainResizeStart?.()
        void qrlResizeStart?.()
      }
    }

    return machineProps as UseSplitterProps
  })

  const store = useApiStore(api)
  SplitterProvider(store)

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
