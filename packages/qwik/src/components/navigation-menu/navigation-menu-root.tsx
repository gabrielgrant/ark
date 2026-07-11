import { mergeProps } from '@zag-js/qwik'
import type { ValueChangeDetails } from '@zag-js/navigation-menu'
import { type QRL, Slot, component$, useStore } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type RenderStrategyProps, RenderStrategyProvider } from '../../utils/render-strategy.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { NavigationMenuProvider } from './use-navigation-menu-context.ts'
import { type UseNavigationMenuProps, useNavigationMenu } from './use-navigation-menu.ts'

const machinePropKeys = [
  'closeDelay',
  'defaultValue',
  'disableClickTrigger',
  'disableHoverTrigger',
  'disablePointerLeaveClose',
  'id',
  'ids',
  'openDelay',
  'orientation',
  'translations',
  'value',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onValueChange$', 'lazyMount', 'unmountOnExit'])

export interface NavigationMenuRootBaseProps
  extends UseNavigationMenuProps, RenderStrategyProps, PolymorphicProps<'nav'> {
  /**
   * QRL variant of `onValueChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onValueChange$?: QRL<(details: ValueChangeDetails) => void>
}
export interface NavigationMenuRootProps extends Assign<HTMLProps<'nav'>, NavigationMenuRootBaseProps> {}

export const NavigationMenuRoot = component$<NavigationMenuRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useNavigationMenu(() => {
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
    return machineProps as UseNavigationMenuProps
  })

  const store = useApiStore(api)
  NavigationMenuProvider(store)

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
    <ark.nav {...rootProps}>
      <Slot />
    </ark.nav>
  )
})
