import type { ItemGroupProps } from '@zag-js/listbox'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$, useId } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useListboxContext } from './use-listbox-context.ts'
import { ListboxItemGroupPropsProvider } from './use-listbox-item-group-props-context.ts'

export interface ListboxItemGroupBaseProps extends PolymorphicProps<'div'> {}
export interface ListboxItemGroupProps extends HTMLProps<'div'>, ListboxItemGroupBaseProps {}

export const ListboxItemGroup = component$<ListboxItemGroupProps>((props) => {
  const autoId = useId()
  const record = props as Record<string, unknown>
  const id = (record.id as string | undefined) ?? autoId
  const itemGroupProps: ItemGroupProps = { id }

  const api = useListboxContext()

  ListboxItemGroupPropsProvider(itemGroupProps)

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
