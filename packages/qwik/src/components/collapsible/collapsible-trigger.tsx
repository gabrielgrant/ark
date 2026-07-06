import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCollapsibleContext } from './use-collapsible-context.ts'

export interface CollapsibleTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface CollapsibleTriggerProps extends HTMLProps<'button'>, CollapsibleTriggerBaseProps {}

export const CollapsibleTrigger = component$<CollapsibleTriggerProps>((props) => {
  const api = useCollapsibleContext()
  const triggerProps = api ? mergeProps(api.getTriggerProps(), props) : props

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
