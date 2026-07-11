import type { ItemGroupProps } from '@zag-js/combobox'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$, useId } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useComboboxContext } from './use-combobox-context.ts'
import { ComboboxItemGroupPropsProvider } from './use-combobox-item-group-props-context.ts'

export interface ComboboxItemGroupBaseProps extends PolymorphicProps<'div'> {}
export interface ComboboxItemGroupProps extends HTMLProps<'div'>, ComboboxItemGroupBaseProps {}

export const ComboboxItemGroup = component$<ComboboxItemGroupProps>((props) => {
  const autoId = useId()
  const record = props as Record<string, unknown>
  const id = (record.id as string | undefined) ?? autoId
  const itemGroupProps: ItemGroupProps = { id }

  const api = useComboboxContext()

  ComboboxItemGroupPropsProvider(itemGroupProps)

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
