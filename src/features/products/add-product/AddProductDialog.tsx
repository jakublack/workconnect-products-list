import { lazy, Suspense, useState } from 'react'
import { Loader2Icon, PlusIcon, RotateCwIcon, XIcon } from 'lucide-react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Product } from '../types'

// The form (TanStack Form, Zod, form controls) is only needed once the dialog opens.
const AddProductForm = lazy(() =>
  import('./AddProductForm').then((module) => ({ default: module.AddProductForm })),
)

interface AddProductDialogProps {
  onProductAdd: (product: Product) => void
}

export function AddProductDialog({ onProductAdd }: AddProductDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <PlusIcon />
          Dodaj produkt
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className={
          'flex flex-col gap-0 p-0 sm:max-h-[calc(100dvh-2rem)] sm:max-w-[720px] ' +
          // Full screen on phones.
          'max-sm:inset-0 max-sm:max-w-none max-sm:translate-none max-sm:rounded-none max-sm:ring-0'
        }
      >
        <DialogHeader className="flex-row items-center justify-between border-b px-4 py-6 max-sm:mx-4 max-sm:px-0 max-sm:pb-4">
          <DialogTitle>Dodaj nowy produkt</DialogTitle>
          <DialogDescription className="sr-only">
            Uzupełnij dane produktu w trzech krokach.
          </DialogDescription>
          <DialogClose asChild>
            <Button variant="ghost" size="icon-sm" className="-my-2 -mr-1.5">
              <XIcon />
              <span className="sr-only">Zamknij</span>
            </Button>
          </DialogClose>
        </DialogHeader>

        {/* The chunk can fail to load (offline, or a newer deploy removed it). */}
        <ErrorBoundary
          fallback={
            <div
              role="alert"
              className="flex h-72 flex-col items-center justify-center gap-4 px-4 text-center"
            >
              <p className="text-sm text-muted-foreground">Nie udało się wczytać formularza.</p>
              <Button variant="outline" size="lg" onClick={() => window.location.reload()}>
                <RotateCwIcon />
                Odśwież stronę
              </Button>
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="flex h-72 items-center justify-center text-muted-foreground">
                <Loader2Icon className="size-5 animate-spin" aria-label="Ładowanie formularza" />
              </div>
            }
          >
            <AddProductForm onProductAdd={onProductAdd} onClose={() => setOpen(false)} />
          </Suspense>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  )
}
