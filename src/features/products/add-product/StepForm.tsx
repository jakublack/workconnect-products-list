import { useRef, type FormEvent, type ReactNode } from 'react'
import { STEP_FORM_ID } from './form-options'

interface StepFormProps {
  onSubmit: () => Promise<void> | void
  children?: ReactNode
}

/** `<form>` for a single step; the dialog footer targets it via `form={STEP_FORM_ID}`. */
export function StepForm({ onSubmit, children }: StepFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit()
    // If the step stayed invalid, move focus to the first field with an error
    // (in a macrotask, so React has already rendered the error state).
    setTimeout(() => {
      const invalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
      const focusTarget = invalid?.querySelector<HTMLElement>('button') ?? invalid
      focusTarget?.focus()
    })
  }

  return (
    <form
      ref={formRef}
      id={STEP_FORM_ID}
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      {children}
    </form>
  )
}
