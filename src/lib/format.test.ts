import { describe, expect, it } from 'vitest'
import { formatPrice, formatProductCount } from './format'

const NBSP = ' '

describe('formatPrice', () => {
  it('formats like the design: comma decimals and the currency code', () => {
    expect(formatPrice(9999, 'PLN')).toBe(`9999,00${NBSP}PLN`)
    expect(formatPrice(179, 'PLN')).toBe(`179,00${NBSP}PLN`)
    expect(formatPrice(1234.5, 'EUR')).toBe(`1234,50${NBSP}EUR`)
  })
})

describe('formatProductCount', () => {
  it.each([
    [1, '1 produkt'],
    [2, '2 produkty'],
    [4, '4 produkty'],
    [5, '5 produktów'],
    [12, '12 produktów'],
    [22, '22 produkty'],
    [0, '0 produktów'],
  ])('%d → %s', (count, expected) => {
    expect(formatProductCount(count)).toBe(expected)
  })
})
