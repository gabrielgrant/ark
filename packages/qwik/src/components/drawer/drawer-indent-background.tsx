import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDrawerStackContext } from './use-drawer-stack-context.ts'

export interface DrawerIndentBackgroundBaseProps extends PolymorphicProps<'div'> {}
export interface DrawerIndentBackgroundProps extends HTMLProps<'div'>, DrawerIndentBackgroundBaseProps {}

export const DrawerIndentBackground = component$<DrawerIndentBackgroundProps>((props) => {
  const stackApi = useDrawerStackContext()
  const indentBackgroundProps = stackApi ? mergeProps(stackApi.getIndentBackgroundProps(), props) : props

  return (
    <ark.div {...indentBackgroundProps}>
      <Slot />
    </ark.div>
  )
})
