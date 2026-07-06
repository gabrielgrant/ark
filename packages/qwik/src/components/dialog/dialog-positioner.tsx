import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresenceContext } from '../presence/index.ts'
import { useDialogContext } from './use-dialog-context.ts'

export interface DialogPositionerBaseProps extends PolymorphicProps<'div'> {}
export interface DialogPositionerProps extends HTMLProps<'div'>, DialogPositionerBaseProps {}

export const DialogPositioner = component$<DialogPositionerProps>((props) => {
  const api = useDialogContext()
  const presence = usePresenceContext()

  if (presence?.unmounted) return null

  const positionerProps = api ? mergeProps(api.getPositionerProps(), props) : props

  return (
    <ark.div {...positionerProps}>
      <Slot />
    </ark.div>
  )
})
