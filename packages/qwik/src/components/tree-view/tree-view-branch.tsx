import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { useRenderStrategyContext } from '../../utils/render-strategy.ts'
import type { CollapsibleRootProps } from '../collapsible/collapsible-root.tsx'
import { Collapsible } from '../collapsible/index.ts'
import type { HTMLProps, PolymorphicProps } from '../factory.tsx'
import { useTreeViewContext } from './use-tree-view-context.ts'
import { useTreeViewNodeContext } from './use-tree-view-node-context.ts'
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context.ts'

export interface TreeViewBranchBaseProps extends PolymorphicProps<'div'> {}
export interface TreeViewBranchProps extends HTMLProps<'div'>, TreeViewBranchBaseProps {}

export const TreeViewBranch = component$<TreeViewBranchProps>((props) => {
  const api = useTreeViewContext()
  const nodeProps = useTreeViewNodePropsContext()
  const nodeState = useTreeViewNodeContext()
  const renderStrategy = useRenderStrategyContext()

  const branchContentId = api?.getBranchContentProps(nodeProps).id
  const branchProps = api ? mergeProps(api.getBranchProps(nodeProps), props) : props

  return (
    <Collapsible.Root
      open={nodeState?.expanded}
      ids={{ content: branchContentId }}
      {...renderStrategy}
      {...(branchProps as unknown as CollapsibleRootProps)}
    >
      <Slot />
    </Collapsible.Root>
  )
})
