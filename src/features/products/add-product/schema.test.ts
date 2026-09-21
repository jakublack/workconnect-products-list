import { afterEach, describe, expect, it, vi } from 'vitest'
import type { z } from 'zod'
import {
  availabilitySchema,
  basicInfoSchema,
  DEFAULT_VALUES,
  pricingSchema,
  productFormSchema,
  toProduct,
} from './schema'

/** Maps issues to `{ fieldName: firstMessage }`, which is what the form shows. */
function fieldErrors(result: z.ZodSafeParseResult<unknown>) {
  const errors: Record<string, string> = {}
  for (const issue of result.error?.issues ?? []) {
    const key = issue.path.join('.')
    errors[key] ??= issue.message
  }
  return errors
}

const validBasicInfo = {
  name: 'MacBook Pro 14"',
  sku: 'MBP14M3PRO',
  description: '',
  manufacturer: 'Apple',
  category: 'Komputery',
  features: ['WiFi'],
}

describe('basicInfoSchema', () => {
  it('accepts valid data', () => {
    expect(basicInfoSchema.safeParse(validBasicInfo).success).toBe(true)
  })

  it('requires every field except the description', () => {
    expect(fieldErrors(basicInfoSchema.safeParse(DEFAULT_VALUES.basicInfo))).toEqual({
      name: 'Podaj nazwę produktu',
      sku: 'Podaj SKU produktu',
      manufacturer: 'Wybierz producenta',
      category: 'Wybierz kategorię',
      features: 'Wybierz co najmniej jedną cechę',
    })
  })

  it('requires a name of at least 3 characters (ignoring whitespace)', () => {
    const result = basicInfoSchema.safeParse({ ...validBasicInfo, name: ' ab ' })
    expect(fieldErrors(result)).toEqual({ name: 'Nazwa musi mieć co najmniej 3 znaki' })
  })

  it.each(['MBP-14', 'MBP 14', 'ŻÓŁW1'])(
    'rejects SKU %j with non-alphanumeric characters',
    (sku) => {
      const result = basicInfoSchema.safeParse({ ...validBasicInfo, sku })
      expect(fieldErrors(result)).toEqual({ sku: 'SKU może zawierać tylko litery i cyfry' })
    },
  )

  it('limits SKU to 24 characters', () => {
    expect(basicInfoSchema.safeParse({ ...validBasicInfo, sku: 'A'.repeat(24) }).success).toBe(true)
    const result = basicInfoSchema.safeParse({ ...validBasicInfo, sku: 'A'.repeat(25) })
    expect(fieldErrors(result)).toEqual({ sku: 'SKU może mieć maksymalnie 24 znaki' })
  })

  it('rejects values outside the predefined lists', () => {
    const result = basicInfoSchema.safeParse({
      ...validBasicInfo,
      manufacturer: 'Nokia',
      features: ['Laser'],
    })
    expect(Object.keys(fieldErrors(result))).toEqual(['manufacturer', 'features.0'])
  })
})

const validPricing = { netPrice: '100', grossPrice: '123.00', vatRate: '23', currency: 'PLN' }

describe('pricingSchema', () => {
  it('converts prices and VAT to numbers', () => {
    expect(pricingSchema.parse({ ...validPricing, netPrice: '99,99' })).toEqual({
      netPrice: 99.99,
      grossPrice: 123,
      vatRate: 23,
      currency: 'PLN',
    })
  })

  it('accepts spaces as thousands separators, like the price sync does', () => {
    const result = pricingSchema.parse({
      ...validPricing,
      netPrice: '1 299,99',
      grossPrice: '1\u00a0598.99',
    })
    expect(result.netPrice).toBe(1299.99)
    expect(result.grossPrice).toBe(1598.99)
  })

  it('requires positive amounts with at most 2 decimals', () => {
    expect(fieldErrors(pricingSchema.safeParse({ ...validPricing, netPrice: '' }))).toEqual({
      netPrice: 'Podaj cenę netto',
    })
    expect(fieldErrors(pricingSchema.safeParse({ ...validPricing, netPrice: '12,345' }))).toEqual({
      netPrice: 'Podaj kwotę, np. 99,99 (maks. 2 miejsca po przecinku)',
    })
    expect(fieldErrors(pricingSchema.safeParse({ ...validPricing, grossPrice: '0' }))).toEqual({
      grossPrice: 'Cena musi być większa od 0',
    })
  })

  it('only accepts the predefined VAT rates and currencies', () => {
    const result = pricingSchema.safeParse({ ...validPricing, vatRate: '7', currency: 'GBP' })
    expect(fieldErrors(result)).toEqual({
      vatRate: 'Wybierz stawkę VAT',
      currency: 'Wybierz walutę',
    })
  })
})

const validAvailability = DEFAULT_VALUES.availability

describe('availabilitySchema', () => {
  it('stores no stock for products that are not limited', () => {
    const result = availabilitySchema.parse({ ...validAvailability, stock: 'ignored' })
    expect(result).toEqual({
      isAvailable: true,
      isLimited: false,
      stock: null,
      minQuantity: 1,
      maxQuantity: 10,
    })
  })

  it('requires a non-negative integer stock only for limited products', () => {
    const limited = { ...validAvailability, isLimited: true }
    expect(fieldErrors(availabilitySchema.safeParse(limited))).toEqual({
      stock: 'Podaj ilość na magazynie',
    })
    expect(fieldErrors(availabilitySchema.safeParse({ ...limited, stock: '-1' }))).toEqual({
      stock: 'Ilość musi być nieujemną liczbą całkowitą',
    })
    expect(fieldErrors(availabilitySchema.safeParse({ ...limited, stock: '1.5' }))).toEqual({
      stock: 'Ilość musi być nieujemną liczbą całkowitą',
    })
    expect(availabilitySchema.parse({ ...limited, stock: '0' }).stock).toBe(0)
  })

  it('requires integer cart limits', () => {
    const result = availabilitySchema.safeParse({ ...validAvailability, minQuantity: '1.5' })
    expect(fieldErrors(result)).toEqual({ minQuantity: 'Podaj liczbę całkowitą' })
  })

  it('flags both limits when min is greater than max', () => {
    const result = availabilitySchema.safeParse({ ...validAvailability, minQuantity: '20' })
    expect(fieldErrors(result)).toEqual({
      minQuantity: 'Nie może być większa niż maksymalna',
      maxQuantity: 'Nie może być mniejsza niż minimalna',
    })
  })

  it('reports the stock and the limits at the same time', () => {
    const result = availabilitySchema.safeParse({
      ...validAvailability,
      isLimited: true,
      minQuantity: 'x',
    })
    expect(Object.keys(fieldErrors(result)).sort()).toEqual(['minQuantity', 'stock'])
  })
})

describe('toProduct', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const parsedForm = () =>
    productFormSchema.parse({
      basicInfo: validBasicInfo,
      pricing: validPricing,
      availability: validAvailability,
    })

  it('creates unique ids outside a secure context (no crypto.randomUUID)', () => {
    // e.g. the dev server opened on a phone via http://192.168.x.x
    vi.stubGlobal('crypto', { getRandomValues: crypto.getRandomValues.bind(crypto) })

    const first = toProduct(parsedForm())
    const second = toProduct(parsedForm())

    expect(first.id).toEqual(expect.any(String))
    expect(first.id).not.toBe(second.id)
  })

  it('maps the parsed form to a product', () => {
    const product = toProduct(
      productFormSchema.parse({
        basicInfo: validBasicInfo,
        pricing: validPricing,
        availability: { ...validAvailability, isLimited: true, stock: '45' },
      }),
    )

    expect(product).toEqual({
      id: expect.any(String),
      name: 'MacBook Pro 14"',
      sku: 'MBP14M3PRO',
      description: '',
      manufacturer: 'Apple',
      category: 'Komputery',
      features: ['WiFi'],
      netPrice: 100,
      grossPrice: 123,
      vatRate: 23,
      currency: 'PLN',
      isAvailable: true,
      stock: 45,
      minCartQuantity: 1,
      maxCartQuantity: 10,
    })
  })
})
