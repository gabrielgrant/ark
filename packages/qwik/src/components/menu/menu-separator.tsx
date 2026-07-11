import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useMenuContext } from './use-menu-context.ts'

export interface MenuSeparatorBaseProps extends PolymorphicProps<'hr'> {}
export interface MenuSeparatorProps extends HTMLProps<'hr'>, MenuSeparatorBaseProps {}

export const MenuSeparator = component$<MenuSeparatorProps>((props) => {
  const api = useMenuContext()
  const separatorProps = api ? mergeProps(api.getSeparatorProps(), props) : props

  return <ark.hr {...separatorProps} />
})
