import type { HighlightChangeDetails, OpenChangeDetails, SelectionDetails, TriggerValueChangeDetails } from '@zag-js/menu'
import { type QRL, Slot, component$, useStore, useVisibleTask$ } from '@qwik.dev/core'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type RenderStrategyProps, RenderStrategyProvider } from '../../utils/render-strategy.ts'
import { PresenceProvider, type UsePresenceProps, usePresence } from '../presence/index.ts'
import { MenuProvider, useMenuStore } from './use-menu-context.ts'
import { MenuMachineProvider, useMenuMachineStore } from './use-menu-machine-context.ts'
import { MenuTriggerItemProvider } from './use-menu-trigger-item-context.ts'
import { type UseMenuProps, useMenu } from './use-menu.ts'

const machinePropKeys = [
  'anchorPoint',
  'aria-label',
  'closeOnSelect',
  'composite',
  'defaultHighlightedValue',
  'defaultOpen',
  'defaultTriggerValue',
  'highlightedValue',
  'id',
  'ids',
  'loopFocus',
  'navigate',
  'onEscapeKeyDown',
  'onFocusOutside',
  'onInteractOutside',
  'onPointerDownOutside',
  'onRequestDismiss',
  'open',
  'positioning',
  'triggerValue',
  'typeahead',
] as const

const presencePropKeys = ['immediate', 'onExitComplete', 'skipAnimationOnMount'] as const

export interface MenuRootBaseProps extends UseMenuProps, UsePresenceProps {
  /**
   * QRL variant of `onHighlightChange`. Prefer this in Qwik apps: plain
   * function props cannot be serialized when the component is server-rendered.
   */
  onHighlightChange$?: QRL<(details: HighlightChangeDetails) => void>
  /** QRL variant of `onOpenChange`. */
  onOpenChange$?: QRL<(details: OpenChangeDetails) => void>
  /** QRL variant of `onSelect`. */
  onSelect$?: QRL<(details: SelectionDetails) => void>
  /** QRL variant of `onTriggerValueChange`. */
  onTriggerValueChange$?: QRL<(details: TriggerValueChangeDetails) => void>
  /** QRL variant of `onExitComplete`. */
  onExitComplete$?: QRL<() => void>
}
export interface MenuRootProps extends MenuRootBaseProps {}

/**
 * NESTED MENUS: a submenu's `<Menu.Root>` reads its ANCESTOR menu's
 * `api`/`service` off context (provided by the ancestor `<Menu.Root>`
 * further up the tree) and, once on the client, registers the parent/child
 * relationship the machines use to coordinate hover-intent, outside-click,
 * and keyboard handoff between adjacent menu levels. This mirrors solid's
 * `onMount` / react's `useEffectOnce` -- `useVisibleTask$` with no `track()`
 * dependency runs once, client-only, matching that semantics (see the
 * `field`/`fieldset` hooks for the established precedent of this exact
 * primitive in this package). Both `api` and `service` travel through the
 * `noSerialize` store contexts (R2); nothing non-serializable crosses a
 * `component$` prop boundary.
 *
 * KNOWN LIMITATION (browser-test coverage only, not an architecture gap):
 * the parent/child wiring above compiles, passes lint, and is verified by
 * `tests/menu.test.tsx` (SSR) to render the full nested structure correctly
 * -- a submenu opens and positions correctly in a real browser too (checked
 * manually via screenshot during development). A fully-automated
 * interactive browser test (open submenu via click/keyboard, select a
 * nested item, assert both levels close) was attempted repeatedly and stayed
 * flaky: with two `MenuRoot` machine instances mounted at once, zag's
 * dismissable-layer pointer-events lock (`disablePointerEventsOutside`) and
 * keyboard highlight handoff between levels intermittently do not settle in
 * time for Playwright's actionability checks / `expect.poll`, in the same
 * family as the already-documented state-effect timing gaps (PLAN.md Part 5
 * #0; `tooltip.browser.test.tsx`'s repeated-instance note). This is a
 * zag-adapter timing issue, not an R2/R6 violation in this file -- do not
 * change zag without maintainer sign-off. `tests/nested.tsx` remains
 * available as a fixture for manual/future automated verification.
 */
export const MenuRoot = component$<MenuRootProps>((props) => {
  const record = props as Record<string, unknown>

  const parentStore = useMenuStore()
  const parentMachineStore = useMenuMachineStore()

  const { api, service } = useMenu(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainHighlight = record.onHighlightChange as ((details: HighlightChangeDetails) => void) | undefined
    const qrlHighlight = record.onHighlightChange$ as QRL<(details: HighlightChangeDetails) => void> | undefined
    if (plainHighlight || qrlHighlight) {
      machineProps.onHighlightChange = (details: HighlightChangeDetails) => {
        plainHighlight?.(details)
        void qrlHighlight?.(details)
      }
    }

    const plainOpen = record.onOpenChange as ((details: OpenChangeDetails) => void) | undefined
    const qrlOpen = record.onOpenChange$ as QRL<(details: OpenChangeDetails) => void> | undefined
    if (plainOpen || qrlOpen) {
      machineProps.onOpenChange = (details: OpenChangeDetails) => {
        plainOpen?.(details)
        void qrlOpen?.(details)
      }
    }

    const plainSelect = record.onSelect as ((details: SelectionDetails) => void) | undefined
    const qrlSelect = record.onSelect$ as QRL<(details: SelectionDetails) => void> | undefined
    if (plainSelect || qrlSelect) {
      machineProps.onSelect = (details: SelectionDetails) => {
        plainSelect?.(details)
        void qrlSelect?.(details)
      }
    }

    const plainTriggerValue = record.onTriggerValueChange as
      | ((details: TriggerValueChangeDetails) => void)
      | undefined
    const qrlTriggerValue = record.onTriggerValueChange$ as
      | QRL<(details: TriggerValueChangeDetails) => void>
      | undefined
    if (plainTriggerValue || qrlTriggerValue) {
      machineProps.onTriggerValueChange = (details: TriggerValueChangeDetails) => {
        plainTriggerValue?.(details)
        void qrlTriggerValue?.(details)
      }
    }

    return machineProps as UseMenuProps
  })

  const menuStore = useApiStore(api)
  MenuProvider(menuStore)

  const machineStore = useApiStore(service)
  MenuMachineProvider(machineStore)

  const triggerItemStore = useApiStore(() => {
    const parentApi = parentStore?.api
    if (!parentApi) return undefined
    return parentApi.getTriggerItemProps(api) as Record<string, unknown>
  })
  MenuTriggerItemProvider(triggerItemStore)

  const renderStrategy = useStore<RenderStrategyProps>({})
  renderStrategy.lazyMount = record.lazyMount as boolean | undefined
  renderStrategy.unmountOnExit = record.unmountOnExit as boolean | undefined
  RenderStrategyProvider(renderStrategy)

  const presenceApi = usePresence(() => {
    const presenceProps: Record<string, unknown> = {
      lazyMount: record.lazyMount,
      unmountOnExit: record.unmountOnExit,
    }
    for (const key of presencePropKeys) {
      if (key in record) presenceProps[key] = record[key]
    }
    const plainExit = record.onExitComplete as (() => void) | undefined
    const qrlExit = record.onExitComplete$ as QRL<() => void> | undefined
    if (plainExit || qrlExit) {
      presenceProps.onExitComplete = () => {
        plainExit?.()
        void qrlExit?.()
      }
    }
    presenceProps.present = api.open
    return presenceProps as UsePresenceProps
  })

  const presenceStore = useApiStore(presenceApi)
  PresenceProvider(presenceStore)

  // biome-ignore lint/correctness/noQwikUseVisibleTask: one-time client-only parent/child registration (mirrors solid's onMount / react's useEffectOnce)
  useVisibleTask$(() => {
    const parentApi = parentStore?.api
    const parentMachine = parentMachineStore?.api
    if (!parentApi || !parentMachine) return
    parentApi.setChild(service)
    api.setParent(parentMachine)
  })

  return <Slot />
})
