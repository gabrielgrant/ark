import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDrawerContext } from './use-drawer-context.ts'

export interface DrawerCloseTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface DrawerCloseTriggerProps extends HTMLProps<'button'>, DrawerCloseTriggerBaseProps {}

export const DrawerCloseTrigger = component$<DrawerCloseTriggerProps>((props) => {
  const api = useDrawerContext()
  const closeTriggerProps = api ? mergeProps(api.getCloseTriggerProps(), props) : props

  return (
    <ark.button {...closeTriggerProps}>
      <Slot />
    </ark.button>
  )
})
