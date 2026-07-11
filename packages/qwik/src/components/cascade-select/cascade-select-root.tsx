import { mergeProps } from '@zag-js/qwik'
import type { HighlightChangeDetails, OpenChangeDetails, ValueChangeDetails } from '@zag-js/cascade-select'
import { type JSXOutput, type QRL, Slot, component$, noSerialize } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import type { TreeNode } from '../collection.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { CascadeSelectProvider } from './use-cascade-select-context.ts'
import { type UseCascadeSelectProps, useCascadeSelect } from './use-cascade-select.ts'

const machinePropKeys = [
  'allowParentSelection',
  'closeOnSelect',
  'collection',
  'defaultHighlightedValue',
  'defaultOpen',
  'defaultValue',
  'disabled',
  'form',
  'formatValue',
  'highlightedValue',
  'highlightTrigger',
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
  'value',
] as const

const ownKeySet = new Set<string>([
  ...machinePropKeys,
  'onHighlightChange$',
  'onOpenChange$',
  'onValueChange$',
])

export interface CascadeSelectRootBaseProps<T extends TreeNode>
  extends UseCascadeSelectProps<T>, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onHighlightChange`. Prefer this in Qwik apps: plain
   * function props cannot be serialized when the component is server-rendered.
   */
  onHighlightChange$?: QRL<(details: HighlightChangeDetails<T>) => void>
  /** QRL variant of `onOpenChange`. */
  onOpenChange$?: QRL<(details: OpenChangeDetails) => void>
  /** QRL variant of `onValueChange`. */
  onValueChange$?: QRL<(details: ValueChangeDetails<T>) => void>
}
export interface CascadeSelectRootProps<T extends TreeNode>
  extends Assign<HTMLProps<'div'>, CascadeSelectRootBaseProps<T>> {}

/**
 * `onFocusOutside`/`onInteractOutside`/`onPointerDownOutside` (dismissable
 * interceptors) and `scrollToIndexFn`/`formatValue` (their results are
 * consumed synchronously by the machine -- `formatValue`'s return value
 * becomes `valueAsString`) get NO `$` QRL variant per R12, matching the
 * select/tree-view precedent.
 */
export const CascadeSelectRoot = component$(<T extends TreeNode>(props: CascadeSelectRootProps<T>) => {
  const record = props as unknown as Record<string, unknown>

  /**
   * `collection` is a `TreeCollection` class instance (methods + closures) --
   * Qwik would otherwise try (and fail, Q20) to serialize it as part of this
   * component's own SSR-resumable prop state. See the matching comment in
   * `tree-view-root.tsx` / `select-root.tsx` for the full rationale;
   * `noSerialize()` tags the SAME object referenced by `props.collection`
   * wherever it is later read from.
   */
  if (typeof record.collection === 'object' && record.collection !== null) {
    noSerialize(record.collection)
  }

  const api = useCascadeSelect<T>(() => {
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

    const plainValue = record.onValueChange as ((details: ValueChangeDetails<T>) => void) | undefined
    const qrlValue = record.onValueChange$ as QRL<(details: ValueChangeDetails<T>) => void> | undefined
    if (plainValue || qrlValue) {
      machineProps.onValueChange = (details: ValueChangeDetails<T>) => {
        plainValue?.(details)
        void qrlValue?.(details)
      }
    }

    return machineProps as unknown as UseCascadeSelectProps<T>
  })

  const store = useApiStore(api)
  CascadeSelectProvider(store)

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
}) as unknown as CascadeSelectRootComponent

export type CascadeSelectRootComponentProps<T extends TreeNode = TreeNode, P = {}> = Assign<
  CascadeSelectRootProps<T>,
  P
>

/**
 * `component$` is not itself generic-callable the way `React.forwardRef` is;
 * the underlying implementation is written as a generic function and cast
 * through `unknown` here (mirrors `SelectRoot`'s cast) so call sites keep the
 * per-`T` collection typing.
 */
export type CascadeSelectRootComponent<P = {}> = <T extends TreeNode>(
  props: CascadeSelectRootComponentProps<T, P>,
) => JSXOutput
