import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTreeViewContext } from './use-tree-view-context.ts'
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context.ts'

export interface TreeViewItemIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface TreeViewItemIndicatorProps extends HTMLProps<'div'>, TreeViewItemIndicatorBaseProps {}

/**
 * `TreeView.Item` (and its ancestors) is a plain `div[role=treeitem]`, not a
 * native interactive element, so (unlike Accordion.ItemIndicator, R11) there
 * is no HTML content-model reason to prefer `<span>` here; matches solid/react.
 */
export const TreeViewItemIndicator = component$<TreeViewItemIndicatorProps>((props) => {
  const api = useTreeViewContext()
  const nodeProps = useTreeViewNodePropsContext()
  const indicatorProps = api ? mergeProps(api.getItemIndicatorProps(nodeProps), props) : props

  return (
    <ark.div {...indicatorProps}>
      <Slot />
    </ark.div>
  )
})
