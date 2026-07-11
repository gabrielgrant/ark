import { mergeProps } from '@zag-js/qwik'
import type {
  CheckedChangeDetails,
  ExpandedChangeDetails,
  FocusChangeDetails,
  LoadChildrenCompleteDetails,
  LoadChildrenErrorDetails,
  RenameCompleteDetails,
  RenameStartDetails,
  SelectionChangeDetails,
} from '@zag-js/tree-view'
import { type JSXOutput, type QRL, Slot, component$, noSerialize, useStore } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type RenderStrategyProps, RenderStrategyProvider } from '../../utils/render-strategy.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import type { TreeNode } from '../collection.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { TreeViewProvider } from './use-tree-view-context.ts'
import { type UseTreeViewProps, useTreeView } from './use-tree-view.ts'

const machinePropKeys = [
  'canRename',
  'checkedValue',
  'collection',
  'defaultCheckedValue',
  'defaultExpandedValue',
  'defaultFocusedValue',
  'defaultSelectedValue',
  'expandedValue',
  'expandOnClick',
  'focusedValue',
  'id',
  'ids',
  'loadChildren',
  'onBeforeRename',
  'onCheckedChange',
  'onExpandedChange',
  'onFocusChange',
  'onLoadChildrenComplete',
  'onLoadChildrenError',
  'onRenameComplete',
  'onRenameStart',
  'onSelectionChange',
  'scrollToIndexFn',
  'selectedValue',
  'selectionMode',
  'translations',
  'typeahead',
] as const

const ownKeySet = new Set<string>([
  ...machinePropKeys,
  'onCheckedChange$',
  'onExpandedChange$',
  'onFocusChange$',
  'onSelectionChange$',
  'onRenameStart$',
  'onRenameComplete$',
  'onLoadChildrenComplete$',
  'onLoadChildrenError$',
  'lazyMount',
  'unmountOnExit',
])

export interface TreeViewRootBaseProps<T extends TreeNode>
  extends UseTreeViewProps<T>, RenderStrategyProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onCheckedChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onCheckedChange$?: QRL<(details: CheckedChangeDetails) => void>
  /** QRL variant of `onExpandedChange`. */
  onExpandedChange$?: QRL<(details: ExpandedChangeDetails<T>) => void>
  /** QRL variant of `onFocusChange`. */
  onFocusChange$?: QRL<(details: FocusChangeDetails<T>) => void>
  /** QRL variant of `onSelectionChange`. */
  onSelectionChange$?: QRL<(details: SelectionChangeDetails<T>) => void>
  /** QRL variant of `onRenameStart`. */
  onRenameStart$?: QRL<(details: RenameStartDetails<T>) => void>
  /** QRL variant of `onRenameComplete`. */
  onRenameComplete$?: QRL<(details: RenameCompleteDetails) => void>
  /** QRL variant of `onLoadChildrenComplete`. */
  onLoadChildrenComplete$?: QRL<(details: LoadChildrenCompleteDetails<T>) => void>
  /** QRL variant of `onLoadChildrenError`. */
  onLoadChildrenError$?: QRL<(details: LoadChildrenErrorDetails<T>) => void>
}
export interface TreeViewRootProps<T extends TreeNode> extends Assign<HTMLProps<'div'>, TreeViewRootBaseProps<T>> {}

/**
 * `canRename` (returns a boolean synchronously consumed by the machine),
 * `onBeforeRename` (return value gates whether the rename proceeds),
 * `loadChildren` (its return value -- a Promise the machine awaits -- IS the
 * data the machine consumes; composing a plain+QRL pair would require
 * discarding one result), and `scrollToIndexFn` (kept plain-only for
 * consistency with `Select`'s precedent) get NO `$` QRL variant per R12/R9 --
 * document this if extending the API.
 */
export const TreeViewRoot = component$(<T extends TreeNode>(props: TreeViewRootProps<T>) => {
  const record = props as unknown as Record<string, unknown>

  /**
   * `collection` is a `TreeCollection` class instance (methods + closures) --
   * Qwik would otherwise try (and fail, Q20) to serialize it as part of this
   * component's own SSR-resumable prop state. See the matching comment in
   * `select-root.tsx` for the full rationale; `noSerialize()` tags the SAME
   * object referenced by `props.collection` wherever it is later read from.
   */
  if (typeof record.collection === 'object' && record.collection !== null) {
    noSerialize(record.collection)
  }

  const api = useTreeView<T>(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainChecked = record.onCheckedChange as ((details: CheckedChangeDetails) => void) | undefined
    const qrlChecked = record.onCheckedChange$ as QRL<(details: CheckedChangeDetails) => void> | undefined
    if (plainChecked || qrlChecked) {
      machineProps.onCheckedChange = (details: CheckedChangeDetails) => {
        plainChecked?.(details)
        void qrlChecked?.(details)
      }
    }

    const plainExpanded = record.onExpandedChange as ((details: ExpandedChangeDetails<T>) => void) | undefined
    const qrlExpanded = record.onExpandedChange$ as QRL<(details: ExpandedChangeDetails<T>) => void> | undefined
    if (plainExpanded || qrlExpanded) {
      machineProps.onExpandedChange = (details: ExpandedChangeDetails<T>) => {
        plainExpanded?.(details)
        void qrlExpanded?.(details)
      }
    }

    const plainFocus = record.onFocusChange as ((details: FocusChangeDetails<T>) => void) | undefined
    const qrlFocus = record.onFocusChange$ as QRL<(details: FocusChangeDetails<T>) => void> | undefined
    if (plainFocus || qrlFocus) {
      machineProps.onFocusChange = (details: FocusChangeDetails<T>) => {
        plainFocus?.(details)
        void qrlFocus?.(details)
      }
    }

    const plainSelection = record.onSelectionChange as ((details: SelectionChangeDetails<T>) => void) | undefined
    const qrlSelection = record.onSelectionChange$ as QRL<(details: SelectionChangeDetails<T>) => void> | undefined
    if (plainSelection || qrlSelection) {
      machineProps.onSelectionChange = (details: SelectionChangeDetails<T>) => {
        plainSelection?.(details)
        void qrlSelection?.(details)
      }
    }

    const plainRenameStart = record.onRenameStart as ((details: RenameStartDetails<T>) => void) | undefined
    const qrlRenameStart = record.onRenameStart$ as QRL<(details: RenameStartDetails<T>) => void> | undefined
    if (plainRenameStart || qrlRenameStart) {
      machineProps.onRenameStart = (details: RenameStartDetails<T>) => {
        plainRenameStart?.(details)
        void qrlRenameStart?.(details)
      }
    }

    const plainRenameComplete = record.onRenameComplete as ((details: RenameCompleteDetails) => void) | undefined
    const qrlRenameComplete = record.onRenameComplete$ as QRL<(details: RenameCompleteDetails) => void> | undefined
    if (plainRenameComplete || qrlRenameComplete) {
      machineProps.onRenameComplete = (details: RenameCompleteDetails) => {
        plainRenameComplete?.(details)
        void qrlRenameComplete?.(details)
      }
    }

    const plainLoadComplete = record.onLoadChildrenComplete as
      | ((details: LoadChildrenCompleteDetails<T>) => void)
      | undefined
    const qrlLoadComplete = record.onLoadChildrenComplete$ as
      | QRL<(details: LoadChildrenCompleteDetails<T>) => void>
      | undefined
    if (plainLoadComplete || qrlLoadComplete) {
      machineProps.onLoadChildrenComplete = (details: LoadChildrenCompleteDetails<T>) => {
        plainLoadComplete?.(details)
        void qrlLoadComplete?.(details)
      }
    }

    const plainLoadError = record.onLoadChildrenError as ((details: LoadChildrenErrorDetails<T>) => void) | undefined
    const qrlLoadError = record.onLoadChildrenError$ as QRL<(details: LoadChildrenErrorDetails<T>) => void> | undefined
    if (plainLoadError || qrlLoadError) {
      machineProps.onLoadChildrenError = (details: LoadChildrenErrorDetails<T>) => {
        plainLoadError?.(details)
        void qrlLoadError?.(details)
      }
    }

    return machineProps as unknown as UseTreeViewProps<T>
  })

  const store = useApiStore(api)
  TreeViewProvider(store)

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
}) as unknown as TreeViewRootComponent

export type TreeViewRootComponentProps<T extends TreeNode = TreeNode, P = {}> = Assign<TreeViewRootProps<T>, P>

/**
 * `component$` is not itself generic-callable the way `React.forwardRef` is;
 * the underlying implementation is written as a generic function and cast
 * through `unknown` here (mirrors the `SelectRoot` cast) so call sites keep
 * the per-`T` collection typing.
 */
export type TreeViewRootComponent<P = {}> = <T extends TreeNode>(props: TreeViewRootComponentProps<T, P>) => JSXOutput
