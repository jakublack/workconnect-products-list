import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatProductCount } from '@/lib/format'
import { MOCK_PRODUCTS } from '../data/mock-products'
import { usePagination } from '../hooks/use-pagination'
import { ProductsPagination } from './ProductsPagination'
import { ProductsTable } from './ProductsTable'

export function ProductsPage() {
  const [products] = useState(MOCK_PRODUCTS)
  const { page, pageCount, pageItems, setPage } = usePagination(products)

  return (
    <main className="mx-auto flex w-full max-w-[1272px] flex-col gap-6 px-4 py-6 md:py-12">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">Produkty</h1>
          <p className="text-sm text-muted-foreground">
            {formatProductCount(products.length)} w katalogu
          </p>
        </div>
        <Button size="lg">
          <PlusIcon />
          Dodaj produkt
        </Button>
      </header>

      <section className="overflow-hidden rounded-lg border bg-card shadow-xs">
        <ProductsTable products={pageItems} />
        <ProductsPagination
          page={page}
          pageCount={pageCount}
          totalCount={products.length}
          onPageChange={setPage}
        />
      </section>
    </main>
  )
}
