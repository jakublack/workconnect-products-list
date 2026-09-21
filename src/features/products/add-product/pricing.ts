export type PriceSource = 'net' | 'gross'

export const AMOUNT_PATTERN = /^\d+([.,]\d{1,2})?$/

export function parseAmount(value: string): number | null {
  const normalized = value.replace(/\s/g, '').replace(',', '.')
  if (!/^\d+(\.\d*)?$/.test(normalized)) return null
  return Number(normalized)
}

export function formatAmount(amount: number): string {
  return amount.toFixed(2)
}

const toCents = (amount: number) => Math.round(amount * 100)

export function netToGross(net: number, vatRate: number): number {
  return Math.round((toCents(net) * (100 + vatRate)) / 100) / 100
}

export function grossToNet(gross: number, vatRate: number): number {
  return Math.round((toCents(gross) * 100) / (100 + vatRate)) / 100
}
