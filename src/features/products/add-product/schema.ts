import { z } from 'zod'
import { CATEGORIES, CURRENCIES, FEATURES, MANUFACTURERS, VAT_RATES } from '../data/options'
import type { Feature, Product } from '../types'
import { AMOUNT_PATTERN, parseAmount } from './pricing'

export const basicInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: 'Podaj nazwę produktu', abort: true })
    .min(3, 'Nazwa musi mieć co najmniej 3 znaki'),
  sku: z
    .string()
    .trim()
    .min(1, { error: 'Podaj SKU produktu', abort: true })
    .regex(/^[A-Za-z0-9]+$/, 'SKU może zawierać tylko litery i cyfry')
    .max(24, 'SKU może mieć maksymalnie 24 znaki'),
  description: z.string().trim(),
  manufacturer: z.enum(MANUFACTURERS, 'Wybierz producenta'),
  category: z.enum(CATEGORIES, 'Wybierz kategorię'),
  features: z.array(z.enum(FEATURES)).min(1, 'Wybierz co najmniej jedną cechę'),
})

const priceSchema = (requiredMessage: string) =>
  z
    .string()
    // Spaces are thousands separators (`1 299,99`), just like in `parseAmount`.
    .overwrite((value) => value.replace(/\s/g, ''))
    .min(1, { error: requiredMessage, abort: true })
    .regex(AMOUNT_PATTERN, {
      error: 'Podaj kwotę, np. 99,99 (maks. 2 miejsca po przecinku)',
      abort: true,
    })
    .transform((value) => parseAmount(value) ?? 0)
    .refine((amount) => amount > 0, 'Cena musi być większa od 0')

export const pricingSchema = z.object({
  netPrice: priceSchema('Podaj cenę netto'),
  grossPrice: priceSchema('Podaj cenę brutto'),
  vatRate: z
    .string()
    .min(1, { error: 'Wybierz stawkę VAT', abort: true })
    .transform(Number)
    .pipe(z.literal(VAT_RATES, 'Wybierz stawkę VAT')),
  currency: z.enum(CURRENCIES, 'Wybierz walutę'),
})

const INTEGER_PATTERN = /^\d+$/

// No `abort` here: an aborting issue would skip the cross-field refinements below.
const quantitySchema = (requiredMessage: string) =>
  z
    .string()
    .trim()
    .min(1, requiredMessage)
    .regex(INTEGER_PATTERN, 'Podaj liczbę całkowitą')
    .transform(Number)
    .refine((quantity) => quantity >= 1, 'Ilość musi wynosić co najmniej 1')

/** Runs a refinement even if other fields failed, as long as `fields` themselves are valid. */
const whenValid =
  (...fields: string[]) =>
  (payload: z.core.ParsePayload) =>
    payload.issues.every((issue) => !fields.includes(String(issue.path?.[0])))

export const availabilitySchema = z
  .object({
    isAvailable: z.boolean(),
    isLimited: z.boolean(),
    stock: z.string().trim(),
    minQuantity: quantitySchema('Podaj minimalną ilość'),
    maxQuantity: quantitySchema('Podaj maksymalną ilość'),
  })
  .superRefine(
    ({ isLimited, stock }, ctx) => {
      if (!isLimited) return
      if (stock === '') {
        ctx.addIssue({ code: 'custom', path: ['stock'], message: 'Podaj ilość na magazynie' })
      } else if (!INTEGER_PATTERN.test(stock)) {
        ctx.addIssue({
          code: 'custom',
          path: ['stock'],
          message: 'Ilość musi być nieujemną liczbą całkowitą',
        })
      }
    },
    { when: whenValid('isLimited', 'stock') },
  )
  .superRefine(
    ({ minQuantity, maxQuantity }, ctx) => {
      if (minQuantity <= maxQuantity) return
      ctx.addIssue({
        code: 'custom',
        path: ['minQuantity'],
        message: 'Nie może być większa niż maksymalna',
      })
      ctx.addIssue({
        code: 'custom',
        path: ['maxQuantity'],
        message: 'Nie może być mniejsza niż minimalna',
      })
    },
    { when: whenValid('minQuantity', 'maxQuantity') },
  )
  // The stock only matters for limited products.
  .transform(({ stock, ...rest }) => ({ ...rest, stock: rest.isLimited ? Number(stock) : null }))

export const productFormSchema = z.object({
  basicInfo: basicInfoSchema,
  pricing: pricingSchema,
  availability: availabilitySchema,
})

export function toProduct({
  basicInfo,
  pricing,
  availability,
}: z.output<typeof productFormSchema>): Product {
  return {
    id: crypto.randomUUID(),
    ...basicInfo,
    ...pricing,
    isAvailable: availability.isAvailable,
    stock: availability.stock,
    minCartQuantity: availability.minQuantity,
    maxCartQuantity: availability.maxQuantity,
  }
}

/**
 * Raw form state. Each step is a nested group validated by its own schema,
 * selects start empty, so they are plain strings until validated.
 */
export interface AddProductFormValues {
  basicInfo: {
    name: string
    sku: string
    description: string
    manufacturer: string
    category: string
    features: Feature[]
  }
  pricing: {
    netPrice: string
    grossPrice: string
    vatRate: string
    currency: string
  }
  availability: {
    isAvailable: boolean
    isLimited: boolean
    stock: string
    minQuantity: string
    maxQuantity: string
  }
}

export const DEFAULT_VALUES: AddProductFormValues = {
  basicInfo: {
    name: '',
    sku: '',
    description: '',
    manufacturer: '',
    category: '',
    features: [],
  },
  pricing: {
    netPrice: '',
    grossPrice: '',
    vatRate: '23',
    currency: 'PLN',
  },
  availability: {
    isAvailable: true,
    isLimited: false,
    stock: '',
    minQuantity: '1',
    maxQuantity: '10',
  },
}
