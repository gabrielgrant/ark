import type { TriggerProps } from '@zag-js/popover'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresenceContext } from '../presence/index.ts'
import { usePopoverContext } from './use-popover-context.ts'

export interface PopoverTriggerBaseProps extends TriggerProps, PolymorphicProps<'button'> {}
export interface PopoverTriggerProps extends Assign<HTMLProps<'button'>, PopoverTriggerBaseProps> {}

export const PopoverTrigger = component$<PopoverTriggerProps>((props) => {
  const { value, ...localProps } = props
  const api = usePopoverContext()
  const presence = usePresenceContext()

  const rest = localProps as unknown as Record<string, unknown>
  const triggerProps = (api ? mergeProps(api.getTriggerProps({ value }), rest) : { ...rest }) as Record<
    string,
    unknown
  >
  if (presence?.unmounted) triggerProps['aria-controls'] = undefined

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
