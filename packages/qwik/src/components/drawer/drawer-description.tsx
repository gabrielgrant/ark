import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDrawerContext } from './use-drawer-context.ts'

export interface DrawerDescriptionBaseProps extends PolymorphicProps<'div'> {}
export interface DrawerDescriptionProps extends HTMLProps<'div'>, DrawerDescriptionBaseProps {}

export const DrawerDescription = component$<DrawerDescriptionProps>((props) => {
  const api = useDrawerContext()
  const descriptionProps = api ? mergeProps(api.getDescriptionProps(), props) : props

  return (
    <ark.div {...descriptionProps}>
      <Slot />
    </ark.div>
  )
})
