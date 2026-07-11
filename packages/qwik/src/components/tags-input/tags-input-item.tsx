import type { ItemProps } from '@zag-js/tags-input'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTagsInputContext } from './use-tags-input-context.ts'
import { TagsInputItemProvider, useTagsInputItemStoreValue } from './use-tags-input-item-context.ts'
import { TagsInputItemPropsProvider } from './use-tags-input-item-props-context.ts'

const itemPropKeys = ['disabled', 'index', 'value'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface TagsInputItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface TagsInputItemProps extends HTMLProps<'div'>, TagsInputItemBaseProps {}

export const TagsInputItem = component$<TagsInputItemProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const itemProps = {} as ItemProps
  for (const key of itemPropKeys) {
    if (key in record) (itemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useTagsInputContext()
  const itemState = api?.getItemState(itemProps)

  TagsInputItemPropsProvider(itemProps)
  TagsInputItemProvider(useTagsInputItemStoreValue(itemState))

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
