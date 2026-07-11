import type { TriggerProps } from '@zag-js/tooltip'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTooltipContext } from './use-tooltip-context.ts'

export interface TooltipTriggerBaseProps extends TriggerProps, PolymorphicProps<'button'> {}
export interface TooltipTriggerProps extends Assign<HTMLProps<'button'>, TooltipTriggerBaseProps> {}

export const TooltipTrigger = component$<TooltipTriggerProps>((props) => {
  const { value, ...localProps } = props
  const api = useTooltipContext()

  const rest = localProps as unknown as Record<string, unknown>
  const triggerProps = api ? mergeProps(api.getTriggerProps({ value }), rest) : rest

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
