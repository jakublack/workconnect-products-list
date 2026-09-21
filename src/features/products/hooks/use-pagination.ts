import { useEffect } from 'react'
import { parseAsInteger, useQueryState } from 'nuqs'

export const PAGE_SIZE = 5

/** Paginates `items` with the current page kept in the `?page=` URL param. */
export function usePagination<T>(items: T[]) {
  const [pageParam, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ history: 'push' }),
  )

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const page = Math.min(Math.max(pageParam, 1), pageCount)

  // Fix an out-of-range page (e.g. `?page=9`) without adding a history entry.
  useEffect(() => {
    if (pageParam !== page) void setPage(page, { history: 'replace' })
  }, [pageParam, page, setPage])

  return {
    page,
    pageCount,
    pageItems: items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    setPage,
  }
}
