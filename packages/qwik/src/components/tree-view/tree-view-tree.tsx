import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTreeViewContext } from './use-tree-view-context.ts'

export interface TreeViewTreeBaseProps extends PolymorphicProps<'div'> {}
export interface TreeViewTreeProps extends HTMLProps<'div'>, TreeViewTreeBaseProps {}

export const TreeViewTree = component$<TreeViewTreeProps>((props) => {
  const api = useTreeViewContext()
  const treeProps = api ? mergeProps(api.getTreeProps(), props) : props

  return (
    <ark.div {...treeProps}>
      <Slot />
    </ark.div>
  )
})
