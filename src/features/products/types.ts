import type { z } from 'zod'
import type { FEATURES } from './data/options'
import type { productSchema } from './product-schema'

export type Feature = (typeof FEATURES)[number]

export type Product = z.infer<typeof productSchema>
