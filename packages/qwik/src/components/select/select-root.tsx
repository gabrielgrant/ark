import { mergeProps } from '@zag-js/qwik'
import type {
  HighlightChangeDetails,
  OpenChangeDetails,
  SelectionDetails,
  ValueChangeDetails,
} from '@zag-js/select'
import { type JSXOutput, type QRL, Slot, component$, noSerialize, useStore } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type RenderStrategyProps, RenderStrategyProvider } from '../../utils/render-strategy.ts'
import type { CollectionItem } from '../collection.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { PresenceProvider, type UsePresenceProps, usePresence } from '../presence/index.ts'
import { SelectProvider } from './use-select-context.ts'
import { type UseSelectProps, useSelect } from './use-select.ts'

const machinePropKeys = [
  'autoComplete',
  'closeOnSelect',
  'collection',
  'composite',
  'defaultHighlightedValue',
  'defaultOpen',
  'defaultValue',
  'deselectable',
  'disabled',
  'form',
  'highlightedValue',
  'id',
  'ids',
  'invalid',
  'loopFocus',
  'multiple',
  'name',
  'onFocusOutside',
  'onInteractOutside',
  'onPointerDownOutside',
  'open',
  'positioning',
  'readOnly',
  'required',
  'scrollToIndexFn',
  'translations',
  'value',
] as const

const presencePropKeys = ['immediate', 'onExitComplete', 'skipAnimationOnMount'] as const

const ownKeySet = new Set<string>([
  ...machinePropKeys,
  ...presencePropKeys,
  'onHighlightChange$',
  'onOpenChange$',
  'onSelect$',
  'onValueChange$',
  'onExitComplete$',
  'lazyMount',
  'unmountOnExit',
])

export interface SelectRootBaseProps<T extends CollectionItem>
  extends UseSelectProps<T>, UsePresenceProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onHighlightChange`. Prefer this in Qwik apps: plain
   * function props cannot be serialized when the component is server-rendered.
   */
  onHighlightChange$?: QRL<(details: HighlightChangeDetails<T>) => void>
  /** QRL variant of `onOpenChange`. */
  onOpenChange$?: QRL<(details: OpenChangeDetails) => void>
  /** QRL variant of `onSelect`. */
  onSelect$?: QRL<(details: SelectionDetails) => void>
  /** QRL variant of `onValueChange`. */
  onValueChange$?: QRL<(details: ValueChangeDetails<T>) => void>
  /** QRL variant of `onExitComplete`. */
  onExitComplete$?: QRL<() => void>
}
export interface SelectRootProps<T extends CollectionItem> extends Assign<HTMLProps<'div'>, SelectRootBaseProps<T>> {}

export const SelectRoot = component$(<T extends CollectionItem>(props: SelectRootProps<T>) => {
  const record = props as unknown as Record<string, unknown>

  /**
   * `collection` is a `ListCollection` class instance (methods + closures) --
   * Qwik would otherwise try (and fail, Q20) to serialize it as part of this
   * component's own SSR-resumable prop state. See the matching comment in
   * `listbox-root.tsx` for the full rationale; `noSerialize()` tags the SAME
   * object referenced by `props.collection` wherever it is later read from.
   */
  if (typeof record.collection === 'object' && record.collection !== null) {
    noSerialize(record.collection)
  }

  const api = useSelect<T>(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainHighlight = record.onHighlightChange as ((details: HighlightChangeDetails<T>) => void) | undefined
    const qrlHighlight = record.onHighlightChange$ as QRL<(details: HighlightChangeDetails<T>) => void> | undefined
    if (plainHighlight || qrlHighlight) {
      machineProps.onHighlightChange = (details: HighlightChangeDetails<T>) => {
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

    const plainValue = record.onValueChange as ((details: ValueChangeDetails<T>) => void) | undefined
    const qrlValue = record.onValueChange$ as QRL<(details: ValueChangeDetails<T>) => void> | undefined
    if (plainValue || qrlValue) {
      machineProps.onValueChange = (details: ValueChangeDetails<T>) => {
        plainValue?.(details)
        void qrlValue?.(details)
      }
    }

    return machineProps as unknown as UseSelectProps<T>
  })

  const store = useApiStore(api)
  SelectProvider(store)

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
}) as unknown as SelectRootComponent

export type SelectRootComponentProps<T extends CollectionItem = CollectionItem, P = {}> = Assign<SelectRootProps<T>, P>

/**
 * `component$` is not itself generic-callable the way `React.forwardRef` is;
 * the underlying implementation is written as a generic function and cast
 * through `unknown` here (mirrors the `forwardRef(...) as SelectRootComponent`
 * cast in the React package) so call sites keep the per-`T` collection typing.
 */
export type SelectRootComponent<P = {}> = <T extends CollectionItem>(
  props: SelectRootComponentProps<T, P>,
) => JSXOutput
