import { type CollectionItem, type CollectionOptions, ListCollection } from '@zag-js/collection'

export type { CollectionItem, CollectionMethods, CollectionOptions, ListCollection } from '@zag-js/collection'

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
