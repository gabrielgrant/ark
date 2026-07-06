import type { TriggerProps } from '@zag-js/dialog'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresenceContext } from '../presence/index.ts'
import { useDialogContext } from './use-dialog-context.ts'

export interface DialogTriggerBaseProps extends TriggerProps, PolymorphicProps<'button'> {}
export interface DialogTriggerProps extends Assign<HTMLProps<'button'>, DialogTriggerBaseProps> {}

export const DialogTrigger = component$<DialogTriggerProps>((props) => {
  const { value, ...localProps } = props
  const api = useDialogContext()
  const presence = usePresenceContext()

  const rest = localProps as unknown as Record<string, unknown>
  const triggerProps = (api ? mergeProps(api.getTriggerProps({ value }), rest) : { ...rest }) as Record<string, unknown>
  if (presence?.unmounted) triggerProps['aria-controls'] = undefined

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
