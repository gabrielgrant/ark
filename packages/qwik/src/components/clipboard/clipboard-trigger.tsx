import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useClipboardContext } from './use-clipboard-context.ts'

export interface ClipboardTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface ClipboardTriggerProps extends HTMLProps<'button'>, ClipboardTriggerBaseProps {}

export const ClipboardTrigger = component$<ClipboardTriggerProps>((props) => {
  const api = useClipboardContext()
  const triggerProps = api ? mergeProps(api.getTriggerProps(), props) : props

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
