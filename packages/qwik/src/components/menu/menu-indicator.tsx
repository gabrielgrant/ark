import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useMenuContext } from './use-menu-context.ts'

export interface MenuIndicatorBaseProps extends PolymorphicProps<'span'> {}
export interface MenuIndicatorProps extends HTMLProps<'span'>, MenuIndicatorBaseProps {}

/**
 * Renders a `span` (not `div`, unlike solid/react): `<Menu.Indicator>` is
 * typically composed directly inside `<Menu.Trigger>`, a `button`, whose
 * content model is phrasing content only -- Qwik's SSR enforces this
 * strictly (Q12), unlike jsdom/browsers (matches `toggle-indicator.tsx`).
 */
export const MenuIndicator = component$<MenuIndicatorProps>((props) => {
  const api = useMenuContext()
  const indicatorProps = api ? mergeProps(api.getIndicatorProps(), props) : props

  return (
    <ark.span {...indicatorProps}>
      <Slot />
    </ark.span>
  )
})
