import type { ItemProps } from '@zag-js/radio-group'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { parts } from './segment-group.anatomy.ts'
import { useSegmentGroupContext } from './use-segment-group-context.ts'
import { SegmentGroupItemProvider, useSegmentGroupItemStoreValue } from './use-segment-group-item-context.ts'
import { SegmentGroupItemPropsProvider } from './use-segment-group-item-props-context.ts'

const itemPropKeys = ['value', 'disabled', 'invalid'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface SegmentGroupItemBaseProps extends ItemProps, PolymorphicProps<'label'> {}
export interface SegmentGroupItemProps extends HTMLProps<'label'>, SegmentGroupItemBaseProps {}

export const SegmentGroupItem = component$<SegmentGroupItemProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const itemProps = {} as ItemProps
  for (const key of itemPropKeys) {
    if (key in record) (itemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useSegmentGroupContext()
  const itemState = api?.getItemState(itemProps)

  SegmentGroupItemPropsProvider(itemProps)
  SegmentGroupItemProvider(useSegmentGroupItemStoreValue(itemState))

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const itemRootProps = api ? mergeProps(api.getItemProps(itemProps), parts.item.attrs as Record<string, string>, rest) : rest

  return (
    <ark.label {...itemRootProps}>
      <Slot />
    </ark.label>
  )
})
