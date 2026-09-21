import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StepperStep {
  title: string
  description: string
}

interface StepperProps {
  steps: readonly StepperStep[]
  currentStep: number
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <ol className={cn('grid grid-cols-3 gap-4 sm:flex sm:items-center', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isUpcoming = index > currentStep

        return (
          <li
            key={step.title}
            aria-current={index === currentStep ? 'step' : undefined}
            className="flex items-center gap-4"
          >
            {index > 0 && (
              <span
                aria-hidden
                className={cn(
                  'hidden h-px w-17 shrink sm:block',
                  isUpcoming ? 'bg-border' : 'bg-primary',
                )}
              />
            )}
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                  isUpcoming
                    ? 'border bg-muted text-muted-foreground'
                    : 'bg-primary text-primary-foreground',
                )}
              >
                {isCompleted ? <CheckIcon className="size-4" /> : index + 1}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className={cn('text-sm font-medium', isUpcoming && 'text-muted-foreground')}>
                  {step.title}
                </span>
                <span className="text-xs text-muted-foreground">{step.description}</span>
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
