import type { ContentProps } from '@zag-js/drawer'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresenceContext } from '../presence/index.ts'
import { useDrawerContext } from './use-drawer-context.ts'

export interface DrawerContentBaseProps extends PolymorphicProps<'div'>, ContentProps {}
export interface DrawerContentProps extends Assign<Omit<HTMLProps<'div'>, 'draggable'>, DrawerContentBaseProps> {}

export const DrawerContent = component$<DrawerContentProps>((props) => {
  const { draggable, ...localProps } = props
  const api = useDrawerContext()
  const presence = usePresenceContext()

  if (presence?.unmounted) return null

  const rest = localProps as unknown as Record<string, unknown>
  const presenceProps = (presence?.presenceProps ?? {}) as Record<string, unknown>
  const contentProps = api
    ? mergeProps(api.getContentProps({ draggable: draggable ?? true }), presenceProps, rest)
    : mergeProps(presenceProps, rest)
  // extract to a local: a member expression in JSX position is compiled to a
  // read-only WrappedSignal, which applyRef cannot write the element into (Q31)
  const contentRef = presence?.ref

  return (
    <ark.div {...contentProps} ref={contentRef}>
      <Slot />
    </ark.div>
  )
})
