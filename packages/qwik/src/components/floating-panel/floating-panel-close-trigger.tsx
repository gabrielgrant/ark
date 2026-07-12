import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFloatingPanelContext } from './use-floating-panel-context.ts'

export interface FloatingPanelCloseTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface FloatingPanelCloseTriggerProps extends HTMLProps<'button'>, FloatingPanelCloseTriggerBaseProps {}

export const FloatingPanelCloseTrigger = component$<FloatingPanelCloseTriggerProps>((props) => {
  const api = useFloatingPanelContext()
  const closeTriggerProps = api ? mergeProps(api.getCloseTriggerProps(), props) : props

  return (
    <ark.button {...closeTriggerProps}>
      <Slot />
    </ark.button>
  )
})
