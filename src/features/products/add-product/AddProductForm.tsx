import { useRef, useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useAppForm } from '@/components/form/app-form'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import type { Product } from '../types'
import { addProductFormOptions, STEP_FORM_ID } from './form-options'
import type { PriceSource } from './pricing'
import { productFormSchema, toProduct } from './schema'
import { Stepper } from './Stepper'
import { AvailabilityStep } from './steps/AvailabilityStep'
import { BasicInfoStep } from './steps/BasicInfoStep'
import { PricingStep } from './steps/PricingStep'

const STEPS = [
  { title: 'Informacje', description: 'Dane podstawowe' },
  { title: 'Cena', description: 'Dane cenowe' },
  { title: 'Dostępność', description: 'Stany magazynowe' },
] as const

const LAST_STEP = STEPS.length - 1

export interface AddProductFormProps {
  onProductAdd: (product: Product) => void
  onClose: () => void
}

export function AddProductForm({ onProductAdd, onClose }: AddProductFormProps) {
  const [step, setStep] = useState(0)
  const isSavedRef = useRef(false)
  const lastEditedPriceRef = useRef<PriceSource>('net')
  const form = useAppForm({
    ...addProductFormOptions,
    onSubmit: ({ value }) => {
      if (isSavedRef.current) return
      isSavedRef.current = true
      onProductAdd(toProduct(productFormSchema.parse(value)))
      onClose()
      toast.success('Produkt został dodany')
    },
  })

  const goToNextStep = () => setStep((current) => Math.min(current + 1, LAST_STEP))

  return (
    <>
      <Stepper
        steps={STEPS}
        currentStep={step}
        className="border-b px-4 py-3 max-sm:mx-4 max-sm:px-0 max-sm:py-6"
      />

      <div className="flex-1 overflow-y-auto px-4 py-5">
        {step === 0 && <BasicInfoStep form={form} onNext={goToNextStep} />}
        {step === 1 && (
          <PricingStep form={form} onNext={goToNextStep} lastEditedPriceRef={lastEditedPriceRef} />
        )}
        {step === 2 && <AvailabilityStep form={form} onSubmit={() => form.handleSubmit()} />}
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
    </>
  )
}
