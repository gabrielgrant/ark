import type { ItemGroupProps } from '@zag-js/select'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$, useId } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSelectContext } from './use-select-context.ts'
import { SelectItemGroupPropsProvider } from './use-select-item-group-props-context.ts'

export interface SelectItemGroupBaseProps extends PolymorphicProps<'div'> {}
export interface SelectItemGroupProps extends HTMLProps<'div'>, SelectItemGroupBaseProps {}

export const SelectItemGroup = component$<SelectItemGroupProps>((props) => {
  const autoId = useId()
  const record = props as Record<string, unknown>
  const id = (record.id as string | undefined) ?? autoId
  const itemGroupProps: ItemGroupProps = { id }

  const api = useSelectContext()

  SelectItemGroupPropsProvider(itemGroupProps)

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
