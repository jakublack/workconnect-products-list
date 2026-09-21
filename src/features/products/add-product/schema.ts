import { z } from 'zod'
import { CATEGORIES, FEATURES, MANUFACTURERS } from '../data/options'
import type { Feature } from '../types'

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
}
