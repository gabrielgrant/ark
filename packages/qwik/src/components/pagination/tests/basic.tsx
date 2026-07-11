import { component$ } from '@qwik.dev/core'
import { Pagination } from '../index.ts'
import { usePaginationContext } from '../use-pagination-context.ts'

/**
 * Solid/React ship a `<Pagination.Context>` render-prop (or read `api.pages`
 * directly) to iterate the machine-computed page/ellipsis list. Qwik omits
 * `Context`/`RootProvider` (R6) -- `usePaginationContext()` is the escape
 * hatch: a small `component$` that reads the store subscribes to it like any
 * other part, so it re-renders whenever `page` changes.
 */
const PaginationItems = component$(() => {
  const api = usePaginationContext()

  return (
    <>
      {api?.pages.map((page, index) =>
        page.type === 'page' ? (
          <Pagination.Item key={page.value} type="page" value={page.value} data-testid={`item-${page.value}`}>
            {page.value}
          </Pagination.Item>
        ) : (
          <Pagination.Ellipsis key={`ellipsis-${index}`} index={index} data-testid={`ellipsis-${index}`}>
            &#8230;
          </Pagination.Ellipsis>
        ),
      )}
    </>
  )
})

export const ComponentUnderTest = (props: Pagination.RootProps) => (
  <Pagination.Root {...props}>
    <Pagination.PrevTrigger data-testid="prev-trigger">Previous</Pagination.PrevTrigger>
    <PaginationItems />
    <Pagination.NextTrigger data-testid="next-trigger">Next</Pagination.NextTrigger>
  </Pagination.Root>
)
