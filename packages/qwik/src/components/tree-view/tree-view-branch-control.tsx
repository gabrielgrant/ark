import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTreeViewContext } from './use-tree-view-context.ts'
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context.ts'

export interface TreeViewBranchControlBaseProps extends PolymorphicProps<'div'> {}
export interface TreeViewBranchControlProps extends HTMLProps<'div'>, TreeViewBranchControlBaseProps {}

export const TreeViewBranchControl = component$<TreeViewBranchControlProps>((props) => {
  const api = useTreeViewContext()
  const nodeProps = useTreeViewNodePropsContext()
  const controlProps = api ? mergeProps(api.getBranchControlProps(nodeProps), props) : props

  return (
    <ark.div {...controlProps}>
      <Slot />
    </ark.div>
  )
})
