import { useEffect, useState } from 'react'
import { z } from 'zod'
import { MOCK_PRODUCTS } from '../data/mock-products'
import { productSchema } from '../product-schema'
import type { Product } from '../types'

export const PRODUCTS_STORAGE_KEY = 'workconnect.products'

function loadProducts(): Product[] {
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY)
    if (stored === null) return MOCK_PRODUCTS
    const result = z.array(productSchema).safeParse(JSON.parse(stored))
    return result.success ? result.data : MOCK_PRODUCTS
  } catch {
    return MOCK_PRODUCTS
  }
}

export function useProducts() {
  const [products, setProducts] = useState(loadProducts)

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
    } catch (error) {
      console.warn('Could not save the products to localStorage.', error)
    }
  }, [products])

  const addProduct = (product: Product) => {
    setProducts((current) => [...current, product])
  }

  return { products, addProduct }
}
