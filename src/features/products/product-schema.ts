import { z } from 'zod'
import { CATEGORIES, CURRENCIES, FEATURES, MANUFACTURERS, VAT_RATES } from './data/options'

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  manufacturer: z.enum(MANUFACTURERS),
  category: z.enum(CATEGORIES),
  features: z.array(z.enum(FEATURES)),
  netPrice: z.number(),
  grossPrice: z.number(),
  vatRate: z.literal(VAT_RATES),
  currency: z.enum(CURRENCIES),
  isAvailable: z.boolean(),
  stock: z.number().nullable(),
  minCartQuantity: z.number(),
  maxCartQuantity: z.number(),
})
