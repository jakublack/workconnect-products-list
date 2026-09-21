import { useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Stepper } from './Stepper'

const STEPS = [
  { title: 'Informacje', description: 'Dane podstawowe' },
  { title: 'Cena', description: 'Dane cenowe' },
  { title: 'Dostępność', description: 'Stany magazynowe' },
] as const

const LAST_STEP = STEPS.length - 1

export function AddProductDialog() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

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
        className="gap-0 p-0 sm:max-w-[720px]"
        // Runs after the close animation, so the dialog doesn't flash step 1 while fading out.
        onCloseAutoFocus={() => setStep(0)}
      >
        <DialogHeader className="flex-row items-center justify-between border-b px-4 py-6">
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

        <Stepper steps={STEPS} currentStep={step} className="border-b px-4 py-3" />

        <div className="px-4 py-5" />

        <DialogFooter className="mx-0 mb-0 flex-row">
          {step > 0 && (
            <Button variant="outline" size="lg" onClick={() => setStep(step - 1)}>
              <ArrowLeftIcon />
              Wstecz
            </Button>
          )}
          {step < LAST_STEP ? (
            <Button size="lg" className="ml-auto" onClick={() => setStep(step + 1)}>
              Dalej
              <ArrowRightIcon />
            </Button>
          ) : (
            <Button size="lg" className="ml-auto">
              Zapisz produkt
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
