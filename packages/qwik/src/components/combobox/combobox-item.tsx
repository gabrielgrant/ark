import type { ItemProps } from '@zag-js/combobox'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useComboboxContext } from './use-combobox-context.ts'
import { ComboboxItemProvider, useComboboxItemStoreValue } from './use-combobox-item-context.ts'
import { ComboboxItemPropsProvider } from './use-combobox-item-props-context.ts'

const itemPropKeys = ['item', 'persistFocus'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface ComboboxItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface ComboboxItemProps extends HTMLProps<'div'>, ComboboxItemBaseProps {}

export const ComboboxItem = component$<ComboboxItemProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const itemProps = {} as ItemProps
  for (const key of itemPropKeys) {
    if (key in record) (itemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useComboboxContext()
  const itemState = api?.getItemState(itemProps)

  ComboboxItemPropsProvider(itemProps)
  ComboboxItemProvider(useComboboxItemStoreValue(itemState))

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
