import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { useRenderStrategyContext } from '../../utils/render-strategy.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresence } from '../presence/index.ts'
import { useDialogContext } from './use-dialog-context.ts'

export interface DialogBackdropBaseProps extends PolymorphicProps<'div'> {}
export interface DialogBackdropProps extends HTMLProps<'div'>, DialogBackdropBaseProps {}

export const DialogBackdrop = component$<DialogBackdropProps>((props) => {
  const api = useDialogContext()
  const renderStrategy = useRenderStrategyContext()
  const presence = usePresence(() => ({
    lazyMount: renderStrategy.lazyMount,
    unmountOnExit: renderStrategy.unmountOnExit,
    present: api?.open ?? false,
  }))

  if (presence.unmounted) return null

  const rest = props as Record<string, unknown>
  const backdropProps = api
    ? mergeProps(api.getBackdropProps(), presence.presenceProps as Record<string, unknown>, rest)
    : mergeProps(presence.presenceProps as Record<string, unknown>, rest)
  const backdropRef = presence.ref

  return <ark.div {...backdropProps} ref={backdropRef} />
})
