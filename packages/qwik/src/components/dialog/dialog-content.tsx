import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresenceContext } from '../presence/index.ts'
import { useDialogContext } from './use-dialog-context.ts'

export interface DialogContentBaseProps extends PolymorphicProps<'div'> {}
export interface DialogContentProps extends HTMLProps<'div'>, DialogContentBaseProps {}

export const DialogContent = component$<DialogContentProps>((props) => {
  const api = useDialogContext()
  const presence = usePresenceContext()

  if (presence?.unmounted) return null

  const rest = props as Record<string, unknown>
  const presenceProps = (presence?.presenceProps ?? {}) as Record<string, unknown>
  const contentProps = api ? mergeProps(api.getContentProps(), presenceProps, rest) : mergeProps(presenceProps, rest)
  // extract to a local: a member expression in JSX position is compiled to a
  // read-only WrappedSignal, which applyRef cannot write the element into (Q31)
  const contentRef = presence?.ref

  return (
    <ark.div {...contentProps} ref={contentRef}>
      <Slot />
    </ark.div>
  )
})
