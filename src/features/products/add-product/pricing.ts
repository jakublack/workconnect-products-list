/** The price the user typed; the other one is calculated from it. */
export type PriceSource = 'net' | 'gross'

/** Positive amount with up to 2 decimals; both `12.5` and `12,5` are accepted. */
export const AMOUNT_PATTERN = /^\d+([.,]\d{1,2})?$/

/** Parses user input (`"1 299,99"`, `"12.5"`) into a number, or `null` if it isn't an amount. */
export function parseAmount(value: string): number | null {
  const normalized = value.replace(/\s/g, '').replace(',', '.')
  if (!/^\d+(\.\d*)?$/.test(normalized)) return null
  return Number(normalized)
}

/** Formats a computed amount for an input, e.g. `123` → `"123.00"`. */
export function formatAmount(amount: number): string {
  return amount.toFixed(2)
}

// Calculations run on integer grosze (cents) to avoid floating point drift.
const toCents = (amount: number) => Math.round(amount * 100)

/** brutto = netto × (1 + VAT / 100), rounded to 2 decimals. */
export function netToGross(net: number, vatRate: number): number {
  return Math.round((toCents(net) * (100 + vatRate)) / 100) / 100
}

/** netto = brutto / (1 + VAT / 100), rounded to 2 decimals. */
export function grossToNet(gross: number, vatRate: number): number {
  return Math.round((toCents(gross) * 100) / (100 + vatRate)) / 100
}
