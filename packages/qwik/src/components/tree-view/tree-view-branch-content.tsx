import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { CollapsibleContentProps } from '../collapsible/collapsible-content.tsx'
import { Collapsible } from '../collapsible/index.ts'
import type { HTMLProps, PolymorphicProps } from '../factory.tsx'
import { useTreeViewContext } from './use-tree-view-context.ts'
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context.ts'

export interface TreeViewBranchContentBaseProps extends PolymorphicProps<'div'> {}
export interface TreeViewBranchContentProps extends HTMLProps<'div'>, TreeViewBranchContentBaseProps {}

/**
 * The tree-view machine's own `getBranchContentProps` computes `hidden`/
 * `data-state` from the *tree-view's* notion of expanded/collapsed, but the
 * actual visibility (incl. exit-animation timing) is owned by the nested
 * `Collapsible.Root`'s own machine (see `tree-view-branch.tsx`, mirrors
 * `accordion-item-content.tsx`). Strip those two keys so the inner
 * Collapsible.Content's own computed props win.
 */
const omitKeySet = new Set<string>(['hidden', 'data-state'])

export const TreeViewBranchContent = component$<TreeViewBranchContentProps>((props) => {
  const api = useTreeViewContext()
  const nodeProps = useTreeViewNodePropsContext()

  const contentProps = api ? (api.getBranchContentProps(nodeProps) as Record<string, unknown>) : {}
  const ownContentProps: Record<string, unknown> = {}
  for (const key in contentProps) {
    if (!omitKeySet.has(key)) ownContentProps[key] = contentProps[key]
  }

  const mergedProps = mergeProps(ownContentProps, props as Record<string, unknown>)

  return (
    <Collapsible.Content {...(mergedProps as unknown as CollapsibleContentProps)}>
      <Slot />
    </Collapsible.Content>
  )
})
