import { render, screen, within } from '@testing-library/react'
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing'
import { describe, expect, it } from 'vitest'
import { MOCK_PRODUCTS } from '../data/mock-products'
import { PRODUCTS_STORAGE_KEY } from '../hooks/use-products'
import type { Product } from '../types'
import { ProductsPage } from './ProductsPage'

const ADDED_PRODUCT: Product = {
  ...MOCK_PRODUCTS[0]!,
  id: 'dell-xps-13',
  name: 'Dell XPS 13',
  sku: 'DLXPS13',
  manufacturer: 'Dell',
}

describe('ProductsPage', () => {
  it('restores the same page with the added products after a refresh', () => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify([...MOCK_PRODUCTS, ADDED_PRODUCT]))

    render(<ProductsPage />, {
      wrapper: withNuqsTestingAdapter({ searchParams: '?page=2', hasMemory: true }),
    })

    expect(screen.getByText('6 produktów w katalogu')).toBeInTheDocument()
    expect(screen.getAllByText('Strona 2 z 2 · 6 produktów')).not.toHaveLength(0)
    const table = screen.getByRole('table')
    expect(within(table).getByText('Dell XPS 13')).toBeInTheDocument()
    expect(within(table).queryByText('MacBook Pro 14"')).not.toBeInTheDocument()
  })
})
