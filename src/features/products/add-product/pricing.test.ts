import { describe, expect, it } from 'vitest'
import { formatAmount, grossToNet, netToGross, parseAmount } from './pricing'

describe('parseAmount', () => {
  it.each([
    ['100', 100],
    ['100,5', 100.5],
    ['100.55', 100.55],
    ['1 299,99', 1299.99],
    ['12.', 12],
  ])('parses %j as %d', (input, expected) => {
    expect(parseAmount(input)).toBe(expected)
  })

  it.each(['', 'abc', '-5', '1,2,3', '12a'])('returns null for %j', (input) => {
    expect(parseAmount(input)).toBeNull()
  })
})

describe('netToGross', () => {
  it('applies the VAT rate: brutto = netto × (1 + VAT / 100)', () => {
    expect(netToGross(100, 23)).toBe(123)
    expect(netToGross(100, 8)).toBe(108)
    expect(netToGross(100, 0)).toBe(100)
  })

  it('rounds to full grosze', () => {
    expect(netToGross(100.5, 23)).toBe(123.62) // 123.615
    expect(netToGross(0.01, 23)).toBe(0.01) // 0.0123
  })

  it('avoids floating point drift', () => {
    expect(netToGross(8129.27, 23)).toBe(9999)
    expect(netToGross(0.1, 23)).toBe(0.12)
  })
})

describe('grossToNet', () => {
  it('is the inverse of netToGross', () => {
    expect(grossToNet(123, 23)).toBe(100)
    expect(grossToNet(108.54, 8)).toBe(100.5)
    expect(grossToNet(246, 0)).toBe(246)
  })

  it('rounds to full grosze', () => {
    expect(grossToNet(246, 8)).toBe(227.78) // 227.777…
  })
})

describe('formatAmount', () => {
  it('always shows two decimals', () => {
    expect(formatAmount(123)).toBe('123.00')
    expect(formatAmount(123.6)).toBe('123.60')
  })
})
