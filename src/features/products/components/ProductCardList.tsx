import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/format'
import type { Product } from '../types'
import { AvailabilityBadge } from './AvailabilityBadge'

interface ProductCardListProps {
  products: Product[]
  className?: string
}

/** Mobile counterpart of `ProductsTable`. */
export function ProductCardList({ products, className }: ProductCardListProps) {
  return (
    <ul className={cn('flex flex-col gap-2', className)}>
      {products.map((product) => (
        <li key={product.id} className="flex flex-col gap-2 rounded-xl border bg-card p-3">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="truncate text-base font-medium">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.sku}</p>
            </div>
            <AvailabilityBadge isAvailable={product.isAvailable} />
          </div>
          <dl className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-3">
            <div className="flex flex-col gap-1">
              <dt className="text-xs text-muted-foreground">Kategoria</dt>
              <dd className="text-sm">{product.category}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs text-muted-foreground">Cena brutto</dt>
              <dd className="text-sm font-medium">
                {formatPrice(product.grossPrice, product.currency)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs text-muted-foreground">Magazyn</dt>
              <dd className="text-sm">{product.stock ?? '—'}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  )
}
