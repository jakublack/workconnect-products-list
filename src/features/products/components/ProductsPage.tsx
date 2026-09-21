import { formatProductCount } from '@/lib/format'
import { AddProductDialog } from '../add-product/AddProductDialog'
import { usePagination } from '../hooks/use-pagination'
import { useProducts } from '../hooks/use-products'
import { ProductCardList } from './ProductCardList'
import { ProductsPagination } from './ProductsPagination'
import { ProductsTable } from './ProductsTable'

export function ProductsPage() {
  const { products, addProduct } = useProducts()
  const { page, pageCount, pageItems, setPage } = usePagination(products)

  return (
    <main className="mx-auto flex w-full max-w-[1272px] flex-col gap-4 px-4 py-6 md:gap-6 md:py-12">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">Produkty</h1>
          <p className="text-sm text-muted-foreground">
            {formatProductCount(products.length)} w katalogu
          </p>
        </div>
        <AddProductDialog onProductAdd={addProduct} />
      </header>

      <section className="flex flex-col gap-6 md:gap-0 md:overflow-hidden md:rounded-lg md:border md:bg-card md:shadow-xs">
        <ProductCardList products={pageItems} className="md:hidden" />
        <div className="hidden md:block">
          <ProductsTable products={pageItems} />
        </div>
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
