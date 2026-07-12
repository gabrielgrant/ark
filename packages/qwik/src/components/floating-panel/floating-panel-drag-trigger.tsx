import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFloatingPanelContext } from './use-floating-panel-context.ts'

export interface FloatingPanelDragTriggerBaseProps extends PolymorphicProps<'div'> {}
export interface FloatingPanelDragTriggerProps extends HTMLProps<'div'>, FloatingPanelDragTriggerBaseProps {}

export const FloatingPanelDragTrigger = component$<FloatingPanelDragTriggerProps>((props) => {
  const api = useFloatingPanelContext()
  const dragTriggerProps = api ? mergeProps(api.getDragTriggerProps(), props) : props

  return (
    <ark.div {...dragTriggerProps}>
      <Slot />
    </ark.div>
  )
})
