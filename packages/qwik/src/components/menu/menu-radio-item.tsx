import type { OptionItemProps } from '@zag-js/menu'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useMenuContext } from './use-menu-context.ts'
import { MenuItemProvider, useMenuItemStoreValue } from './use-menu-item-context.ts'
import { useMenuItemGroupContext } from './use-menu-item-group-context.ts'
import { MenuItemPropsProvider } from './use-menu-item-props-context.ts'

type PartialOptionItemProps = Omit<OptionItemProps, 'type' | 'checked' | 'onCheckedChange'>

const itemPropKeys = ['closeOnSelect', 'disabled', 'value', 'valueText'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface MenuRadioItemBaseProps extends PartialOptionItemProps, PolymorphicProps<'div'> {}
export interface MenuRadioItemProps extends HTMLProps<'div'>, MenuRadioItemBaseProps {}

export const MenuRadioItem = component$<MenuRadioItemProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const partialItemProps = {} as PartialOptionItemProps
  for (const key of itemPropKeys) {
    if (key in record) (partialItemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useMenuContext()
  const itemGroup = useMenuItemGroupContext()
  const value = (partialItemProps as { value: string }).value
  const optionItemProps: OptionItemProps = {
    ...partialItemProps,
    type: 'radio',
    checked: itemGroup?.value === value,
    onCheckedChange: () => itemGroup?.onValueChange?.({ value }),
  }

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
