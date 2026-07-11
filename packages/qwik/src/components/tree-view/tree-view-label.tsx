import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTreeViewContext } from './use-tree-view-context.ts'

export interface TreeViewLabelBaseProps extends PolymorphicProps<'h3'> {}
export interface TreeViewLabelProps extends HTMLProps<'h3'>, TreeViewLabelBaseProps {}

export const TreeViewLabel = component$<TreeViewLabelProps>((props) => {
  const api = useTreeViewContext()
  const labelProps = api ? mergeProps(api.getLabelProps(), props) : props

  return (
    <ark.h3 {...labelProps}>
      <Slot />
    </ark.h3>
  )
})
