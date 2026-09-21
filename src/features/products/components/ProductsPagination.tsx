import type { MouseEvent } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { formatProductCount } from '@/lib/format'
import { cn } from '@/lib/utils'

interface ProductsPaginationProps {
  page: number
  pageCount: number
  totalCount: number
  onPageChange: (page: number) => void
}

export function ProductsPagination({
  page,
  pageCount,
  totalCount,
  onPageChange,
}: ProductsPaginationProps) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)
  const hasPrevious = page > 1
  const hasNext = page < pageCount

  const linkProps = (target: number, enabled = true) => ({
    href: enabled ? `?page=${target}` : undefined,
    'aria-disabled': !enabled || undefined,
    className: cn(!enabled && 'pointer-events-none text-muted-foreground'),
    onClick: (event: MouseEvent<HTMLAnchorElement>) => {
      if (enabled && (event.metaKey || event.ctrlKey || event.shiftKey)) return
      event.preventDefault()
      if (enabled) onPageChange(target)
    },
  })

  return (
    <div className="flex flex-col items-center gap-4 md:h-16 md:flex-row md:justify-between md:border-t md:bg-muted/50 md:px-4">
      <p className="text-xs text-muted-foreground">
        Strona {page} z {pageCount} · {formatProductCount(totalCount)}
      </p>
      <Pagination className="mx-0 w-auto">
        <PaginationContent className="gap-1">
          <PaginationItem>
            <PaginationPrevious {...linkProps(page - 1, hasPrevious)} />
          </PaginationItem>
          {pages.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink isActive={pageNumber === page} {...linkProps(pageNumber)}>
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext {...linkProps(page + 1, hasNext)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
