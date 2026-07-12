import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDrawerStackContext } from './use-drawer-stack-context.ts'

export interface DrawerIndentBaseProps extends PolymorphicProps<'div'> {}
export interface DrawerIndentProps extends HTMLProps<'div'>, DrawerIndentBaseProps {}

export const DrawerIndent = component$<DrawerIndentProps>((props) => {
  const stackApi = useDrawerStackContext()
  const indentProps = stackApi ? mergeProps(stackApi.getIndentProps(), props) : props

  return (
    <ark.div {...indentProps}>
      <Slot />
    </ark.div>
  )
})
