import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTreeViewContext } from './use-tree-view-context.ts'
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context.ts'

export interface TreeViewBranchIndentGuideBaseProps extends PolymorphicProps<'div'> {}
export interface TreeViewBranchIndentGuideProps extends HTMLProps<'div'>, TreeViewBranchIndentGuideBaseProps {}

export const TreeViewBranchIndentGuide = component$<TreeViewBranchIndentGuideProps>((props) => {
  const api = useTreeViewContext()
  const nodeProps = useTreeViewNodePropsContext()
  const guideProps = api ? mergeProps(api.getBranchIndentGuideProps(nodeProps), props) : props

  return (
    <ark.div {...guideProps}>
      <Slot />
    </ark.div>
  )
})
