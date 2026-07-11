import {
  type CollectionItem,
  type CollectionOptions,
  type FilePathTreeNode,
  ListCollection,
  TreeCollection,
  type TreeCollectionOptions,
  type TreeNode,
  filePathToTree,
} from '@zag-js/collection'

export type {
  CollectionItem,
  CollectionMethods,
  CollectionOptions,
  ListCollection,
  FilePathTreeNode,
  FlatTreeNode,
  TreeCollection,
  TreeCollectionOptions,
  TreeNode,
} from '@zag-js/collection'

/**
 * Mirrors `packages/solid/src/components/collection/list-collection.ts`.
 *
 * `ListCollection` is a plain class instance -- it carries no framework
 * reactivity of its own. It is constructed once (by the consuming app, or in
 * a test fixture) and handed to a machine's `collection` prop. In this
 * package that only ever happens inside a `Root` component's machine-props
 * getter (R4: `useMachine(machine, () => ({ ...collection, ... }))`), which
 * lives in the same `component$` closure as the call site -- the instance
 * never crosses a serializable prop/context boundary, so Qwik's
 * serialization rules for `component$` props and context values never apply
 * to it. Do not pass a `ListCollection` through a context provider or as a
 * `component$` prop on its own; keep construction next to the `Root` that
 * consumes it.
 */
export const createListCollection = <T extends CollectionItem>(options: CollectionOptions<T>): ListCollection<T> =>
  new ListCollection(options)

/**
 * Same construction-site rule as `createListCollection` above: `TreeCollection`
 * is a plain class instance with no framework reactivity, constructed once and
 * handed straight into a tree-view/cascade-select machine's `collection` prop
 * inside a `Root` component's machine-props getter (never through a context
 * provider or as a standalone `component$` prop -- see `use-tree-view.ts`).
 */
export const createTreeCollection = <T extends TreeNode>(options: TreeCollectionOptions<T>): TreeCollection<T> =>
  new TreeCollection(options)

export const createFileTreeCollection = (paths: string[]): TreeCollection<FilePathTreeNode> => filePathToTree(paths)
