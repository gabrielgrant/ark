import type { TriggerProps } from '@zag-js/hover-card'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useHoverCardContext } from './use-hover-card-context.ts'

export interface HoverCardTriggerBaseProps extends TriggerProps, PolymorphicProps<'button'> {}
export interface HoverCardTriggerProps extends Assign<HTMLProps<'button'>, HoverCardTriggerBaseProps> {}

export const HoverCardTrigger = component$<HoverCardTriggerProps>((props) => {
  const { value, ...localProps } = props
  const api = useHoverCardContext()

  const rest = localProps as unknown as Record<string, unknown>
  const triggerProps = api ? mergeProps(api.getTriggerProps({ value }), rest) : rest

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
