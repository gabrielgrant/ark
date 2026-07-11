import type { ItemProps } from '@zag-js/pagination'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePaginationContext } from './use-pagination-context.ts'

const itemPropKeys = ['type', 'value'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface PaginationItemBaseProps extends ItemProps, PolymorphicProps<'button'> {}
export interface PaginationItemProps extends Assign<HTMLProps<'button'>, PaginationItemBaseProps> {}

export const PaginationItem = component$<PaginationItemProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const itemProps = {} as ItemProps
  for (const key of itemPropKeys) {
    if (key in record) (itemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = usePaginationContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const itemButtonProps = api ? mergeProps(api.getItemProps(itemProps), rest) : rest

  return (
    <ark.button {...itemButtonProps}>
      <Slot />
    </ark.button>
  )
})
