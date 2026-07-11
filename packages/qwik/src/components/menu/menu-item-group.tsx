import type { ItemGroupProps } from '@zag-js/menu'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$, useId } from '@qwik.dev/core'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useMenuContext } from './use-menu-context.ts'
import { MenuItemGroupProvider } from './use-menu-item-group-context.ts'

export interface MenuItemGroupBaseProps extends PolymorphicProps<'div'> {}
export interface MenuItemGroupProps extends HTMLProps<'div'>, MenuItemGroupBaseProps {}

export const MenuItemGroup = component$<MenuItemGroupProps>((props) => {
  const autoId = useId()
  const record = props as Record<string, unknown>
  const id = (record.id as string | undefined) ?? autoId
  const itemGroupProps: ItemGroupProps = { id }

  const api = useMenuContext()

  MenuItemGroupProvider(useApiStore({ id }))

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (key !== 'id') rest[key] = record[key]
  }

  const itemGroupDivProps = api ? mergeProps(api.getItemGroupProps(itemGroupProps), rest) : rest

  return (
    <ark.div {...itemGroupDivProps}>
      <Slot />
    </ark.div>
  )
})
