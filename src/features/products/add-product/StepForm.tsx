import { useRef, type FormEvent, type ReactNode } from 'react'
import type { AnyFormGroupApi } from '@tanstack/react-form'
import { STEP_FORM_ID } from './form-options'

interface StepFormProps {
  /** The `form.FormGroup` of the step. */
  group: AnyFormGroupApi
  children?: ReactNode
}

/** `<form>` for a single step; the dialog footer targets it via `form={STEP_FORM_ID}`. */
export function StepForm({ group, children }: StepFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // "Dalej" reveals the errors of every field in the step, not only of the ones already left.
    for (const field of group.getRelatedFields()) {
      field.setMeta((meta) => ({ ...meta, isBlurred: true }))
    }
    await group.handleSubmit()
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
