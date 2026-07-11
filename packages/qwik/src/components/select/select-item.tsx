import type { ItemProps } from '@zag-js/select'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSelectContext } from './use-select-context.ts'
import { SelectItemProvider, useSelectItemStoreValue } from './use-select-item-context.ts'
import { SelectItemPropsProvider } from './use-select-item-props-context.ts'

const itemPropKeys = ['item', 'persistFocus'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface SelectItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface SelectItemProps extends HTMLProps<'div'>, SelectItemBaseProps {}

export const SelectItem = component$<SelectItemProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const itemProps = {} as ItemProps
  for (const key of itemPropKeys) {
    if (key in record) (itemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useSelectContext()
  const itemState = api?.getItemState(itemProps)

  SelectItemPropsProvider(itemProps)
  SelectItemProvider(useSelectItemStoreValue(itemState))

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
