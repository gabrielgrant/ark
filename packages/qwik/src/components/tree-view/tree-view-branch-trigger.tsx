import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTreeViewContext } from './use-tree-view-context.ts'
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context.ts'

export interface TreeViewBranchTriggerBaseProps extends PolymorphicProps<'div'> {}
export interface TreeViewBranchTriggerProps extends HTMLProps<'div'>, TreeViewBranchTriggerBaseProps {}

export const TreeViewBranchTrigger = component$<TreeViewBranchTriggerProps>((props) => {
  const api = useTreeViewContext()
  const nodeProps = useTreeViewNodePropsContext()
  const triggerProps = api ? mergeProps(api.getBranchTriggerProps(nodeProps), props) : props

  return (
    <ark.div {...triggerProps}>
      <Slot />
    </ark.div>
  )
})
