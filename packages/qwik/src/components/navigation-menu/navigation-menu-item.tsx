import type { ItemProps } from '@zag-js/navigation-menu'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useNavigationMenuContext } from './use-navigation-menu-context.ts'
import { NavigationMenuItemPropsProvider } from './use-navigation-menu-item-props-context.ts'

const itemPropKeys = ['value', 'disabled'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface NavigationMenuItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface NavigationMenuItemProps extends HTMLProps<'div'>, NavigationMenuItemBaseProps {}

export const NavigationMenuItem = component$<NavigationMenuItemProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const itemProps = {} as ItemProps
  for (const key of itemPropKeys) {
    if (key in record) (itemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useNavigationMenuContext()

  NavigationMenuItemPropsProvider(itemProps)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const itemDivProps = api ? mergeProps(api.getItemProps(itemProps), rest) : rest

  return (
    <ark.div {...itemDivProps}>
      <Slot />
    </ark.div>
  )
})
