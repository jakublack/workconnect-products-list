import type { CATEGORIES, CURRENCIES, FEATURES, MANUFACTURERS, VAT_RATES } from './data/options'

export type Manufacturer = (typeof MANUFACTURERS)[number]
export type Category = (typeof CATEGORIES)[number]
export type Feature = (typeof FEATURES)[number]
export type VatRate = (typeof VAT_RATES)[number]
export type Currency = (typeof CURRENCIES)[number]

export interface Product {
  id: string
  name: string
  sku: string
  description: string
  manufacturer: Manufacturer
  category: Category
  features: Feature[]
  netPrice: number
  grossPrice: number
  vatRate: VatRate
  currency: Currency
  isAvailable: boolean
  stock: number | null
  minCartQuantity: number
  maxCartQuantity: number
}
