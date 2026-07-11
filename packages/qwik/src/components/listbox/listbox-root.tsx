import { mergeProps } from '@zag-js/qwik'
import type { HighlightChangeDetails, SelectionDetails, ValueChangeDetails } from '@zag-js/listbox'
import { type JSXOutput, type QRL, Slot, component$, noSerialize } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import type { CollectionItem } from '../collection.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { ListboxProvider } from './use-listbox-context.ts'
import { type UseListboxProps, useListbox } from './use-listbox.ts'

const machinePropKeys = [
  'collection',
  'defaultHighlightedValue',
  'defaultValue',
  'deselectable',
  'disabled',
  'disallowSelectAll',
  'highlightedValue',
  'id',
  'ids',
  'loopFocus',
  'onHighlightChange',
  'onSelect',
  'onValueChange',
  'orientation',
  'scrollToIndexFn',
  'selectionMode',
  'selectOnHighlight',
  'typeahead',
  'value',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onHighlightChange$', 'onSelect$', 'onValueChange$'])

export interface ListboxRootBaseProps<T extends CollectionItem>
  extends UseListboxProps<T>, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onHighlightChange`. Prefer this in Qwik apps: plain
   * function props cannot be serialized when the component is server-rendered.
   */
  onHighlightChange$?: QRL<(details: HighlightChangeDetails<T>) => void>
  /** QRL variant of `onSelect`. */
  onSelect$?: QRL<(details: SelectionDetails) => void>
  /** QRL variant of `onValueChange`. */
  onValueChange$?: QRL<(details: ValueChangeDetails<T>) => void>
}
export interface ListboxRootProps<T extends CollectionItem> extends Assign<HTMLProps<'div'>, ListboxRootBaseProps<T>> {}

export const ListboxRoot = component$(<T extends CollectionItem>(props: ListboxRootProps<T>) => {
  const record = props as unknown as Record<string, unknown>

  /**
   * `collection` is a `ListCollection` class instance (methods + closures) --
   * Qwik would otherwise try (and fail, Q20) to serialize it as part of this
   * component's own SSR-resumable prop state. `noSerialize()` tags the SAME
   * object referenced by `props.collection` (it registers the reference in
   * an internal WeakSet; the marker applies wherever that reference is later
   * read from), so this single call is enough even though the value entered
   * through a JSX prop rather than a local variable inside this closure.
   * `useListbox`'s props getter (R4) re-reads `record.collection` fresh on
   * every render, including the client render that runs when the component
   * wakes from a pre-wake interaction -- so within the two test layers this
   * package uses (SSR-markup-only, and pure-CSR interaction, per R5), the
   * collection is never actually missing when the machine needs it. A build
   * that performs a real SSR-serialize-then-resume round trip (this repo's
   * test harness cannot exercise that path at all yet -- PLAN.md Part 5 #1)
   * would see `collection` come back `undefined` after resume, per
   * `noSerialize`'s documented contract; that is the same class of gap as
   * the already-documented wake-path limitation, not a new one introduced
   * here.
   */
  if (typeof record.collection === 'object' && record.collection !== null) {
    noSerialize(record.collection)
  }

  const api = useListbox<T>(() => {
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

    return machineProps as unknown as UseListboxProps<T>
  })

  const store = useApiStore(api)
  ListboxProvider(store)

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
}) as unknown as ListboxRootComponent

export type ListboxRootComponentProps<T extends CollectionItem = CollectionItem, P = {}> = Assign<
  ListboxRootProps<T>,
  P
>

/**
 * `component$` is not itself generic-callable the way `React.forwardRef` is;
 * the underlying implementation is written as a generic function and cast
 * through `unknown` here (mirrors the `forwardRef(...) as ListboxRootComponent`
 * cast in the React package) so call sites keep the per-`T` collection typing.
 */
export type ListboxRootComponent<P = {}> = <T extends CollectionItem>(
  props: ListboxRootComponentProps<T, P>,
) => JSXOutput
