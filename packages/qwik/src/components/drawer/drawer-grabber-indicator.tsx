import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDrawerContext } from './use-drawer-context.ts'

export interface DrawerGrabberIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface DrawerGrabberIndicatorProps extends HTMLProps<'div'>, DrawerGrabberIndicatorBaseProps {}

export const DrawerGrabberIndicator = component$<DrawerGrabberIndicatorProps>((props) => {
  const api = useDrawerContext()
  const grabberIndicatorProps = api ? mergeProps(api.getGrabberIndicatorProps(), props) : props

  return (
    <ark.div {...grabberIndicatorProps}>
      <Slot />
    </ark.div>
  )
})
