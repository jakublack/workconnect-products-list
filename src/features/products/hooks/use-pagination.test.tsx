import { act, renderHook, waitFor } from '@testing-library/react'
import { withNuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing'
import { describe, expect, it, vi } from 'vitest'
import { usePagination } from './use-pagination'

const ITEMS = Array.from({ length: 12 }, (_, index) => index + 1)

function renderPagination(searchParams = '', items = ITEMS) {
  const onUrlUpdate = vi.fn<OnUrlUpdateFunction>()
  const view = renderHook(() => usePagination(items), {
    wrapper: withNuqsTestingAdapter({ searchParams, onUrlUpdate, hasMemory: true }),
  })
  return { ...view, onUrlUpdate }
}

describe('usePagination', () => {
  it('starts on page 1 with 5 items per page', () => {
    const { result } = renderPagination()

    expect(result.current.page).toBe(1)
    expect(result.current.pageCount).toBe(3)
    expect(result.current.pageItems).toEqual([1, 2, 3, 4, 5])
  })

  it('reads the page from the URL, so a refresh keeps the view', () => {
    const { result } = renderPagination('?page=3')

    expect(result.current.page).toBe(3)
    expect(result.current.pageItems).toEqual([11, 12])
  })

  it('pushes a history entry when the page changes', async () => {
    const { result, onUrlUpdate } = renderPagination()

    await act(() => result.current.setPage(2))

    expect(result.current.pageItems).toEqual([6, 7, 8, 9, 10])
    expect(onUrlUpdate).toHaveBeenCalledOnce()
    const [{ searchParams, options }] = onUrlUpdate.mock.lastCall!
    expect(searchParams.get('page')).toBe('2')
    expect(options.history).toBe('push')
  })

  it('replaces an out-of-range page with the last existing one', async () => {
    const { result, onUrlUpdate } = renderPagination('?page=9')

    expect(result.current.page).toBe(3)
    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalledOnce())
    const [{ searchParams, options }] = onUrlUpdate.mock.lastCall!
    expect(searchParams.get('page')).toBe('3')
    expect(options.history).toBe('replace')
  })

  it('falls back to page 1 for an invalid page param', () => {
    expect(renderPagination('?page=abc').result.current.page).toBe(1)
    expect(renderPagination('?page=-2').result.current.page).toBe(1)
  })

  it('keeps a single empty page when there are no items', () => {
    const { result } = renderPagination('', [])

    expect(result.current.pageCount).toBe(1)
    expect(result.current.pageItems).toEqual([])
  })
})
