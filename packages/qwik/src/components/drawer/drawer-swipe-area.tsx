import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDrawerContext } from './use-drawer-context.ts'

export interface DrawerSwipeAreaBaseProps extends PolymorphicProps<'div'> {}
export interface DrawerSwipeAreaProps extends HTMLProps<'div'>, DrawerSwipeAreaBaseProps {}

export const DrawerSwipeArea = component$<DrawerSwipeAreaProps>((props) => {
  const api = useDrawerContext()
  const swipeAreaProps = api ? mergeProps(api.getSwipeAreaProps(), props) : props

  return (
    <ark.div {...swipeAreaProps}>
      <Slot />
    </ark.div>
  )
})
