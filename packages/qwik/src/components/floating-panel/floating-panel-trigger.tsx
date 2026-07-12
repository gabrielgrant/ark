import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresenceContext } from '../presence/index.ts'
import { useFloatingPanelContext } from './use-floating-panel-context.ts'

export interface FloatingPanelTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface FloatingPanelTriggerProps extends HTMLProps<'button'>, FloatingPanelTriggerBaseProps {}

export const FloatingPanelTrigger = component$<FloatingPanelTriggerProps>((props) => {
  const api = useFloatingPanelContext()
  const presence = usePresenceContext()

  const rest = props as Record<string, unknown>
  const triggerProps = (api ? mergeProps(api.getTriggerProps(), rest) : { ...rest }) as Record<string, unknown>
  if (presence?.unmounted) triggerProps['aria-controls'] = undefined

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
