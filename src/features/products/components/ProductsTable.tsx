import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatPrice } from '@/lib/format'
import type { Product } from '../types'
import { AvailabilityBadge } from './AvailabilityBadge'

interface ProductsTableProps {
  products: Product[]
}

const COLUMNS = ['Nazwa', 'SKU', 'Kategoria', 'Cena Brutto', 'Status', 'Magazyn'] as const

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          {COLUMNS.map((column) => (
            <TableHead
              key={column}
              className="px-4 font-normal text-muted-foreground first:w-[29%]"
            >
              {column}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="h-12 truncate px-4 font-medium">{product.name}</TableCell>
            <TableCell className="h-12 truncate px-4 text-xs text-muted-foreground">
              {product.sku}
            </TableCell>
            <TableCell className="h-12 truncate px-4 text-muted-foreground">
              {product.category}
            </TableCell>
            <TableCell className="h-12 px-4 font-medium">
              {formatPrice(product.grossPrice, product.currency)}
            </TableCell>
            <TableCell className="h-12 px-4">
              <AvailabilityBadge isAvailable={product.isAvailable} />
            </TableCell>
            <TableCell className="h-12 px-4 font-medium">{product.stock ?? '—'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
