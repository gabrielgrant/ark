import { mergeProps } from '@zag-js/qwik'
import { Slot, component$, useId } from '@qwik.dev/core'
import type { Optional } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useMenuContext } from './use-menu-context.ts'
import { MenuItemGroupProvider, type MenuItemGroupValue } from './use-menu-item-group-context.ts'

type OptionalMenuItemGroupValue = Optional<MenuItemGroupValue, 'id'>

const groupPropKeys = ['id', 'onValueChange', 'value'] as const

const ownKeySet = new Set<string>(groupPropKeys)

export interface MenuRadioItemGroupBaseProps extends OptionalMenuItemGroupValue, PolymorphicProps<'div'> {}
export interface MenuRadioItemGroupProps extends HTMLProps<'div'>, MenuRadioItemGroupBaseProps {}

export const MenuRadioItemGroup = component$<MenuRadioItemGroupProps>((props) => {
  const autoId = useId()
  const record = props as Record<string, unknown>

  const itemGroupProps: MenuItemGroupValue = { id: (record.id as string | undefined) ?? autoId }
  if ('value' in record) itemGroupProps.value = record.value as string
  if ('onValueChange' in record) {
    itemGroupProps.onValueChange = record.onValueChange as MenuItemGroupValue['onValueChange']
  }

  const api = useMenuContext()

  MenuItemGroupProvider(useApiStore(itemGroupProps))

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const itemGroupDivProps = api ? mergeProps(api.getItemGroupProps({ id: itemGroupProps.id }), rest) : rest

  return (
    <ark.div {...itemGroupDivProps}>
      <Slot />
    </ark.div>
  )
})
