import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTreeViewContext } from './use-tree-view-context.ts'
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context.ts'

export interface TreeViewBranchIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface TreeViewBranchIndicatorProps extends HTMLProps<'div'>, TreeViewBranchIndicatorBaseProps {}

export const TreeViewBranchIndicator = component$<TreeViewBranchIndicatorProps>((props) => {
  const api = useTreeViewContext()
  const nodeProps = useTreeViewNodePropsContext()
  const indicatorProps = api ? mergeProps(api.getBranchIndicatorProps(nodeProps), props) : props

  return (
    <ark.div {...indicatorProps}>
      <Slot />
    </ark.div>
  )
})
