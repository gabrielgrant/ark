import { mergeProps } from '@zag-js/qwik'
import type { PageChangeDetails, PageSizeChangeDetails } from '@zag-js/pagination'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { PaginationProvider } from './use-pagination-context.ts'
import { type UsePaginationProps, usePagination } from './use-pagination.ts'

const machinePropKeys = [
  'boundaryCount',
  'count',
  'defaultPage',
  'defaultPageSize',
  'getPageUrl',
  'id',
  'ids',
  'page',
  'pageSize',
  'siblingCount',
  'translations',
  'type',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onPageChange$', 'onPageSizeChange$'])

export interface PaginationRootBaseProps extends UsePaginationProps, PolymorphicProps<'nav'> {
  /**
   * QRL variant of `onPageChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onPageChange$?: QRL<(details: PageChangeDetails) => void>
  /** QRL variant of `onPageSizeChange`. */
  onPageSizeChange$?: QRL<(details: PageSizeChangeDetails) => void>
}
export interface PaginationRootProps extends Assign<HTMLProps<'nav'>, PaginationRootBaseProps> {}

export const PaginationRoot = component$<PaginationRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = usePagination(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainPage = record.onPageChange as ((details: PageChangeDetails) => void) | undefined
    const qrlPage = record.onPageChange$ as QRL<(details: PageChangeDetails) => void> | undefined
    if (plainPage || qrlPage) {
      machineProps.onPageChange = (details: PageChangeDetails) => {
        plainPage?.(details)
        void qrlPage?.(details)
      }
    }

    const plainPageSize = record.onPageSizeChange as ((details: PageSizeChangeDetails) => void) | undefined
    const qrlPageSize = record.onPageSizeChange$ as QRL<(details: PageSizeChangeDetails) => void> | undefined
    if (plainPageSize || qrlPageSize) {
      machineProps.onPageSizeChange = (details: PageSizeChangeDetails) => {
        plainPageSize?.(details)
        void qrlPageSize?.(details)
      }
    }

    return machineProps as UsePaginationProps
  })

  const store = useApiStore(api)
  PaginationProvider(store)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const rootProps = mergeProps(api.getRootProps(), rest)

  return (
    <ark.nav {...rootProps}>
      <Slot />
    </ark.nav>
  )
})
