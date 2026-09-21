const LOCALE = 'pl-PL'

const pluralRules = new Intl.PluralRules(LOCALE)

/** Formats an amount as in the design, e.g. `9999,00 PLN`. */
export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency,
    currencyDisplay: 'code',
  }).format(amount)
}

const PRODUCT_FORMS: Partial<Record<Intl.LDMLPluralRule, string>> = {
  one: 'produkt',
  few: 'produkty',
}

/** `1 produkt`, `2 produkty`, `5 produktów` */
export function formatProductCount(count: number): string {
  return `${count} ${PRODUCT_FORMS[pluralRules.select(count)] ?? 'produktów'}`
}
