import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDrawerContext } from './use-drawer-context.ts'

export interface DrawerTitleBaseProps extends PolymorphicProps<'h2'> {}
export interface DrawerTitleProps extends HTMLProps<'h2'>, DrawerTitleBaseProps {}

export const DrawerTitle = component$<DrawerTitleProps>((props) => {
  const api = useDrawerContext()
  const titleProps = api ? mergeProps(api.getTitleProps(), props) : props

  return (
    <ark.h2 {...titleProps}>
      <Slot />
    </ark.h2>
  )
})
