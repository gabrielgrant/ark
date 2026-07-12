import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDrawerContext } from './use-drawer-context.ts'

export interface DrawerGrabberBaseProps extends PolymorphicProps<'div'> {}
export interface DrawerGrabberProps extends HTMLProps<'div'>, DrawerGrabberBaseProps {}

export const DrawerGrabber = component$<DrawerGrabberProps>((props) => {
  const api = useDrawerContext()
  const grabberProps = api ? mergeProps(api.getGrabberProps(), props) : props

  return (
    <ark.div {...grabberProps}>
      <Slot />
    </ark.div>
  )
})
