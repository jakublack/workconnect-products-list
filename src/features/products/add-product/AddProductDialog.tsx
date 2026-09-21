import { useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon, XIcon } from 'lucide-react'
import { useAppForm } from '@/components/form/app-form'
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
import { addProductFormOptions, STEP_FORM_ID } from './form-options'
import { StepForm } from './StepForm'
import { Stepper } from './Stepper'
import { BasicInfoStep } from './steps/BasicInfoStep'
import { PricingStep } from './steps/PricingStep'

const STEPS = [
  { title: 'Informacje', description: 'Dane podstawowe' },
  { title: 'Cena', description: 'Dane cenowe' },
  { title: 'Dostępność', description: 'Stany magazynowe' },
] as const

const LAST_STEP = STEPS.length - 1

export function AddProductDialog() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const form = useAppForm(addProductFormOptions)

  const goToNextStep = () => setStep((current) => Math.min(current + 1, LAST_STEP))

  const resetDialog = () => {
    form.reset()
    setStep(0)
  }

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
        onCloseAutoFocus={resetDialog}
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

        <div className="px-4 py-5">
          {step === 0 && <BasicInfoStep form={form} onNext={goToNextStep} />}
          {step === 1 && <PricingStep form={form} onNext={goToNextStep} />}
          {step === 2 && <StepForm onSubmit={() => {}} />}
        </div>

        <DialogFooter className="mx-0 mb-0 flex-row">
          {step > 0 && (
            <Button variant="outline" size="lg" onClick={() => setStep(step - 1)}>
              <ArrowLeftIcon />
              Wstecz
            </Button>
          )}
          {step < LAST_STEP ? (
            <Button type="submit" form={STEP_FORM_ID} size="lg" className="ml-auto">
              Dalej
              <ArrowRightIcon />
            </Button>
          ) : (
            <Button type="submit" form={STEP_FORM_ID} size="lg" className="ml-auto">
              Zapisz produkt
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
