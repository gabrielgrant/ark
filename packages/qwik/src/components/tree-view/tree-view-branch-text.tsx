import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTreeViewContext } from './use-tree-view-context.ts'
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context.ts'

export interface TreeViewBranchTextBaseProps extends PolymorphicProps<'span'> {}
export interface TreeViewBranchTextProps extends HTMLProps<'span'>, TreeViewBranchTextBaseProps {}

export const TreeViewBranchText = component$<TreeViewBranchTextProps>((props) => {
  const api = useTreeViewContext()
  const nodeProps = useTreeViewNodePropsContext()
  const textProps = api ? mergeProps(api.getBranchTextProps(nodeProps), props) : props

  return (
    <ark.span {...textProps}>
      <Slot />
    </ark.span>
  )
})
