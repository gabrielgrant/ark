import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresence } from '../presence/index.ts'
import { useRenderStrategyContext } from '../../utils/render-strategy.ts'
import { useDrawerContext } from './use-drawer-context.ts'

export interface DrawerBackdropBaseProps extends PolymorphicProps<'div'> {}
export interface DrawerBackdropProps extends HTMLProps<'div'>, DrawerBackdropBaseProps {}

export const DrawerBackdrop = component$<DrawerBackdropProps>((props) => {
  const api = useDrawerContext()
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
