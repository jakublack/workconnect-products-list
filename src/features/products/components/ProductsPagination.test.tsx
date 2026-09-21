import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ProductsPagination } from './ProductsPagination'

function renderPagination(page = 1) {
  const onPageChange = vi.fn()
  render(
    <ProductsPagination page={page} pageCount={3} totalCount={12} onPageChange={onPageChange} />,
  )
  return { onPageChange }
}

describe('ProductsPagination', () => {
  it('shows the current page and the total product count', () => {
    renderPagination(2)

    expect(screen.getByText('Strona 2 z 3 · 12 produktów')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '2' })).toHaveAttribute('aria-current', 'page')
  })

  it('changes the page in place on a plain click', () => {
    const { onPageChange } = renderPagination()

    const notPrevented = fireEvent.click(screen.getByRole('link', { name: '3' }))

    expect(notPrevented).toBe(false)
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it.each(['metaKey', 'ctrlKey', 'shiftKey'] as const)(
    'leaves a %s click to the browser (open in a new tab/window)',
    (modifier) => {
      const { onPageChange } = renderPagination()

      const notPrevented = fireEvent.click(screen.getByRole('link', { name: '3' }), {
        [modifier]: true,
      })

      expect(notPrevented).toBe(true)
      expect(onPageChange).not.toHaveBeenCalled()
    },
  )

  it('disables "Wstecz" on the first page and "Dalej" on the last one', () => {
    const { onPageChange } = renderPagination(1)

    const previous = screen.getByText('Wstecz').closest('a')!
    expect(previous).toHaveAttribute('aria-disabled', 'true')
    expect(previous).not.toHaveAttribute('href')
    fireEvent.click(previous)
    expect(onPageChange).not.toHaveBeenCalled()
  })
})
