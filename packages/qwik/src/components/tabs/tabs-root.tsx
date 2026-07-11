import type { FocusChangeDetails, ValueChangeDetails } from '@zag-js/tabs'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$, useStore } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type RenderStrategyProps, RenderStrategyProvider } from '../../utils/render-strategy.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { TabsProvider } from './use-tabs-context.ts'
import { type UseTabsProps, useTabs } from './use-tabs.ts'

const machinePropKeys = [
  'activationMode',
  'composite',
  'defaultValue',
  'deselectable',
  'id',
  'ids',
  'loopFocus',
  'navigate',
  'onFocusChange',
  'onValueChange',
  'orientation',
  'translations',
  'value',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onValueChange$', 'onFocusChange$', 'lazyMount', 'unmountOnExit'])

export interface TabsRootBaseProps extends UseTabsProps, RenderStrategyProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onValueChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onValueChange$?: QRL<(details: ValueChangeDetails) => void>
  /** QRL variant of `onFocusChange`. */
  onFocusChange$?: QRL<(details: FocusChangeDetails) => void>
}
export interface TabsRootProps extends Assign<HTMLProps<'div'>, TabsRootBaseProps> {}

export const TabsRoot = component$<TabsRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useTabs(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }
    const plainValue = record.onValueChange as ((details: ValueChangeDetails) => void) | undefined
    const qrlValue = record.onValueChange$ as QRL<(details: ValueChangeDetails) => void> | undefined
    if (plainValue || qrlValue) {
      machineProps.onValueChange = (details: ValueChangeDetails) => {
        plainValue?.(details)
        void qrlValue?.(details)
      }
    }
    const plainFocus = record.onFocusChange as ((details: FocusChangeDetails) => void) | undefined
    const qrlFocus = record.onFocusChange$ as QRL<(details: FocusChangeDetails) => void> | undefined
    if (plainFocus || qrlFocus) {
      machineProps.onFocusChange = (details: FocusChangeDetails) => {
        plainFocus?.(details)
        void qrlFocus?.(details)
      }
    }
    return machineProps as UseTabsProps
  })

  const store = useApiStore(api)
  TabsProvider(store)

  const renderStrategy = useStore<RenderStrategyProps>({})
  renderStrategy.lazyMount = record.lazyMount as boolean | undefined
  renderStrategy.unmountOnExit = record.unmountOnExit as boolean | undefined
  RenderStrategyProvider(renderStrategy)

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
