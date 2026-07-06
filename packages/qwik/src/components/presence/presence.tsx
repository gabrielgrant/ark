import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { splitPresenceProps } from './split-presence-props.ts'
import { type UsePresenceProps, usePresence } from './use-presence.ts'

export interface PresenceBaseProps extends UsePresenceProps, PolymorphicProps<'div'> {}
export interface PresenceProps extends HTMLProps<'div'>, PresenceBaseProps {}

export const Presence = component$<PresenceProps>((props) => {
  const [presenceProps, localProps] = splitPresenceProps(props as PresenceProps)
  const api = usePresence(() => presenceProps)

  if (api.unmounted) return null

  const merged = mergeProps(api.presenceProps, localProps as Record<string, unknown>)
  const presenceRef = api.ref

  return (
    <ark.div {...merged} ref={presenceRef} data-scope="presence" data-part="root">
      <Slot />
    </ark.div>
  )
})
