import type { EllipsisProps } from '@zag-js/pagination'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePaginationContext } from './use-pagination-context.ts'

const ellipsisPropKeys = ['index'] as const

const ownKeySet = new Set<string>(ellipsisPropKeys)

export interface PaginationEllipsisBaseProps extends EllipsisProps, PolymorphicProps<'div'> {}
export interface PaginationEllipsisProps extends HTMLProps<'div'>, PaginationEllipsisBaseProps {}

export const PaginationEllipsis = component$<PaginationEllipsisProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const ellipsisProps = {} as EllipsisProps
  for (const key of ellipsisPropKeys) {
    if (key in record) (ellipsisProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = usePaginationContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const ellipsisDivProps = api ? mergeProps(api.getEllipsisProps(ellipsisProps), rest) : rest

  return (
    <ark.div {...ellipsisDivProps}>
      <Slot />
    </ark.div>
  )
})
