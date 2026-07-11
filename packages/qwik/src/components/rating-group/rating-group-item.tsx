import type { ItemProps } from '@zag-js/rating-group'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useRatingGroupContext } from './use-rating-group-context.ts'
import { RatingGroupItemProvider, useRatingGroupItemStoreValue } from './use-rating-group-item-context.ts'

const itemPropKeys = ['index'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface RatingGroupItemBaseProps extends ItemProps, PolymorphicProps<'span'> {}
export interface RatingGroupItemProps extends HTMLProps<'span'>, RatingGroupItemBaseProps {}

export const RatingGroupItem = component$<RatingGroupItemProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const itemProps = {} as ItemProps
  for (const key of itemPropKeys) {
    if (key in record) (itemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useRatingGroupContext()
  const itemState = api?.getItemState(itemProps)

  RatingGroupItemProvider(useRatingGroupItemStoreValue(itemState))

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const itemSpanProps = api ? mergeProps(api.getItemProps(itemProps), rest) : rest

  return (
    <ark.span {...itemSpanProps}>
      <Slot />
    </ark.span>
  )
})
