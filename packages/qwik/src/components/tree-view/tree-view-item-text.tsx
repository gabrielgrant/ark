import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTreeViewContext } from './use-tree-view-context.ts'
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context.ts'

export interface TreeViewItemTextBaseProps extends PolymorphicProps<'span'> {}
export interface TreeViewItemTextProps extends HTMLProps<'span'>, TreeViewItemTextBaseProps {}

export const TreeViewItemText = component$<TreeViewItemTextProps>((props) => {
  const api = useTreeViewContext()
  const nodeProps = useTreeViewNodePropsContext()
  const itemTextProps = api ? mergeProps(api.getItemTextProps(nodeProps), props) : props

  return (
    <ark.span {...itemTextProps}>
      <Slot />
    </ark.span>
  )
})
