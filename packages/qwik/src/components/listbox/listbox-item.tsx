import type { ItemProps } from '@zag-js/listbox'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useListboxContext } from './use-listbox-context.ts'
import { ListboxItemProvider, useListboxItemStoreValue } from './use-listbox-item-context.ts'
import { ListboxItemPropsProvider } from './use-listbox-item-props-context.ts'

const itemPropKeys = ['item', 'highlightOnHover'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface ListboxItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface ListboxItemProps extends HTMLProps<'div'>, ListboxItemBaseProps {}

export const ListboxItem = component$<ListboxItemProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const itemProps = {} as ItemProps
  for (const key of itemPropKeys) {
    if (key in record) (itemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useListboxContext()
  const itemState = api?.getItemState(itemProps)

  ListboxItemPropsProvider(itemProps)
  ListboxItemProvider(useListboxItemStoreValue(itemState))

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
