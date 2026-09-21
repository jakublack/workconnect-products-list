# Products — multi-step "add product" form

A products page with a table and a three-step "Dodaj produkt" form in a dialog, built after the Figma design (desktop and mobile). The UI is in Polish, as in the design.

**Live demo:** https://splendid-sunburst-1e362c.netlify.app

## Stack

| Area           | Technology                                                    |
| -------------- | ------------------------------------------------------------- |
| UI             | React 19, TypeScript 6 (strict), Vite 8, Tailwind CSS 4       |
| Components     | shadcn/ui (_nova_ preset, Radix UI), Lucide icons, Geist font |
| Form           | TanStack Form 1.33 (a `FormGroup` per step)                   |
| Validation     | Zod 4 (a schema per step)                                     |
| URL pagination | nuqs 2                                                        |
| Notifications  | Sonner                                                        |
| Tests          | Vitest 4, Testing Library, jsdom                              |
| Code quality   | oxlint, Prettier                                              |

## Getting started

Requires Node.js **20.19+** (Vite 8 requirement).

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173.

### Scripts

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | development server                       |
| `npm run build`      | type check and production build (`dist`) |
| `npm run preview`    | preview the production build             |
| `npm test`           | run the tests once                       |
| `npm run test:watch` | run the tests in watch mode              |
| `npm run typecheck`  | TypeScript type check                    |
| `npm run lint`       | lint (oxlint)                            |
| `npm run format`     | format (Prettier)                        |

## Features

**Product list**

- A table on desktop and cards on mobile (below 768 px), with 5 mock products to start with.
- Columns: name, SKU, category, gross price with currency, availability, stock ("—" for products without a stock limit).
- Pagination with 5 products per page. The page number lives in `?page=` (nuqs) and the products are saved in `localStorage`, so a refresh keeps the view, including added products. The browser's back button returns to the previous page, and an out-of-range page (e.g. `?page=9`) is corrected without adding a history entry.

**Form in a dialog**

- Three steps: _Informacje_ → _Cena_ → _Dostępność_, with a stepper showing progress. On phones the dialog is full screen.
- "Dalej" moves on only when the current step is valid. Otherwise it shows the errors next to the fields and focuses the first invalid one.
- "Wstecz" goes back without losing values. All steps are a single TanStack Form, and each step is a `FormGroup` with its own Zod schema.
- Closing the dialog resets the form to an empty step 1.
- "Zapisz produkt" appends the product to the table, closes the dialog and shows a "Produkt został dodany" toast.

**Prices**

- Changing the net price recalculates the gross price and vice versa: `gross = net × (1 + VAT / 100)`.
- Changing the VAT rate recalculates whichever price the user did not edit last.
- Calculations run on integer grosze (cents) and are rounded to 2 decimals. Both a comma and a dot are accepted as the decimal separator, and spaces as thousands separators (`1 299,99`).

## Validation

| Field                   | Rule                                                                |
| ----------------------- | ------------------------------------------------------------------- |
| Product name            | required, at least 3 characters                                     |
| SKU                     | required, letters and digits only (A–Z, 0–9), at most 24 characters |
| Description             | optional                                                            |
| Manufacturer, category  | chosen from a list                                                  |
| Product features        | at least one                                                        |
| Net / gross price       | required, greater than 0, at most 2 decimals                        |
| VAT, currency           | chosen from a list (23 / 8 / 5 / 0%; PLN / EUR / USD)               |
| Stock quantity          | shown and required only for limited products; integer ≥ 0           |
| Min / max cart quantity | integers ≥ 1, min ≤ max (the error is shown on both fields)         |

An error shows up only after the user leaves the field or clicks "Dalej", never while they are still typing. Once shown, it disappears as soon as the value becomes valid.

## Structure

```
src/
├── components/
│   ├── ui/                  # shadcn/ui components (adjusted to the design)
│   └── form/                # form fields: shadcn Field + TanStack Form (createFormHook)
├── features/products/
│   ├── components/          # page, table, mobile cards, pagination, availability badge
│   ├── hooks/               # usePagination (nuqs)
│   ├── data/                # mock data and option lists
│   ├── add-product/
│   │   ├── schema.ts        # Zod schemas of the steps + mapping to Product
│   │   ├── pricing.ts       # net ↔ gross calculations
│   │   ├── steps/           # step components (withForm + FormGroup)
│   │   └── …                # dialog, form, stepper
│   └── types.ts
└── lib/                     # price and count formatting (Intl, pl-PL)
```

## Decisions and assumptions

- **5 products to start with.** The spec asks for 5 products, while the design shows "7 produktów w katalogu". I followed the spec, so a second page appears once a sixth product is added.
- **Products in `localStorage`.** Without it, a refresh would drop added products and the page they are on, so "a refresh keeps the view" couldn't hold. Stored data is validated with a Zod schema (the `Product` type is inferred from it); if it's missing, broken or outdated, the app starts from the mock products. To start over, clear the site data in the browser.
- **"Opis" field.** In Figma the textarea is labelled "Nazwa produktu" (a copy-paste slip), so the app labels it "Opis".
- **VAT rate** is a select with a chevron, as the spec requires, although in Figma it looks like a plain input.
- **Selected product features** are highlighted with the primary color. The design doesn't show a selected state.
- **Cart limits ≥ 1.** The spec only asks for integers, but a cart limit of 0 wouldn't make sense.
- **Inputs use a 16 px font on mobile**, while the design uses 14 px. This is shadcn/ui's default, and it stops iOS from zooming in when a field is focused. From 768 px up the font is 14 px, as in the design.
- **The form is lazy-loaded** (`React.lazy`) when the dialog opens, which keeps the main JS bundle smaller. If the chunk fails to load (offline, or a newer deploy), the dialog shows a reload prompt instead of breaking the page.

## Tests

```bash
npm test
```

- **Unit:** Zod schemas (every rule from the table above), price calculations and rounding, price formatting and Polish plural forms ("produkt / produkty / produktów"), URL pagination (nuqs testing adapter).
- **Integration** (Testing Library, user-like interactions): blocking a step with errors, when errors are shown, going back without losing values, net / gross / VAT sync, reset on close, the conditional stock field, saving a product.
