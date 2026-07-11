import type { OptionItemProps } from '@zag-js/menu'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useMenuContext } from './use-menu-context.ts'
import { MenuItemProvider, useMenuItemStoreValue } from './use-menu-item-context.ts'
import { MenuItemPropsProvider } from './use-menu-item-props-context.ts'

type PartialOptionItemProps = Omit<OptionItemProps, 'type'>

const itemPropKeys = ['checked', 'closeOnSelect', 'disabled', 'onCheckedChange', 'value', 'valueText'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface MenuCheckboxItemBaseProps extends PartialOptionItemProps, PolymorphicProps<'div'> {}
export interface MenuCheckboxItemProps extends HTMLProps<'div'>, MenuCheckboxItemBaseProps {}

export const MenuCheckboxItem = component$<MenuCheckboxItemProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const partialOptionItemProps = {} as PartialOptionItemProps
  for (const key of itemPropKeys) {
    if (key in record) (partialOptionItemProps as unknown as Record<string, unknown>)[key] = record[key]
  }
  const optionItemProps: OptionItemProps = { ...partialOptionItemProps, type: 'checkbox' }

  const api = useMenuContext()

  MenuItemPropsProvider(useApiStore(optionItemProps))
  MenuItemProvider(useMenuItemStoreValue(api?.getOptionItemState(optionItemProps)))

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const itemDivProps = api ? mergeProps(api.getOptionItemProps(optionItemProps), rest) : rest

  return (
    <ark.div {...itemDivProps}>
      <Slot />
    </ark.div>
  )
})
