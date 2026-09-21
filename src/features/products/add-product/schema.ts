import { z } from 'zod'
import { CATEGORIES, CURRENCIES, FEATURES, MANUFACTURERS, VAT_RATES } from '../data/options'
import type { Feature } from '../types'
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
    .trim()
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
}
