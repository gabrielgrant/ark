import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTreeViewContext } from './use-tree-view-context.ts'
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context.ts'

export interface TreeViewItemBaseProps extends PolymorphicProps<'div'> {}
export interface TreeViewItemProps extends HTMLProps<'div'>, TreeViewItemBaseProps {}

export const TreeViewItem = component$<TreeViewItemProps>((props) => {
  const api = useTreeViewContext()
  const nodeProps = useTreeViewNodePropsContext()
  const itemProps = api ? mergeProps(api.getItemProps(nodeProps), props) : props

  return (
    <ark.div {...itemProps}>
      <Slot />
    </ark.div>
  )
})
