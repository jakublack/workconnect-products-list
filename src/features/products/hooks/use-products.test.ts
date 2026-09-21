import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MOCK_PRODUCTS } from '../data/mock-products'
import type { Product } from '../types'
import { PRODUCTS_STORAGE_KEY, useProducts } from './use-products'

const NEW_PRODUCT: Product = {
  ...MOCK_PRODUCTS[0]!,
  id: 'dell-xps-13',
  name: 'Dell XPS 13',
  sku: 'DLXPS13',
  manufacturer: 'Dell',
}

const storedProducts = () => JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY) ?? 'null')

describe('useProducts', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts with the mock products', () => {
    const { result } = renderHook(() => useProducts())

    expect(result.current.products).toEqual(MOCK_PRODUCTS)
  })

  it('keeps added products after a page refresh', () => {
    const { result, unmount } = renderHook(() => useProducts())
    act(() => result.current.addProduct(NEW_PRODUCT))
    expect(storedProducts()).toHaveLength(MOCK_PRODUCTS.length + 1)

    unmount()
    const { result: afterRefresh } = renderHook(() => useProducts())

    expect(afterRefresh.current.products).toEqual([...MOCK_PRODUCTS, NEW_PRODUCT])
  })

  it.each([
    ['broken JSON', '{"products":'],
    ['not a list', '{"name":"MacBook"}'],
    ['products in an outdated shape', JSON.stringify([{ id: '1', title: 'MacBook', price: 9999 }])],
  ])('falls back to the mock products for %s', (_, stored) => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, stored)

    const { result } = renderHook(() => useProducts())

    expect(result.current.products).toEqual(MOCK_PRODUCTS)
  })

  it('keeps working in memory when the storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Access denied', 'SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    })
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { result } = renderHook(() => useProducts())
    act(() => result.current.addProduct(NEW_PRODUCT))

    expect(result.current.products).toEqual([...MOCK_PRODUCTS, NEW_PRODUCT])
  })
})
