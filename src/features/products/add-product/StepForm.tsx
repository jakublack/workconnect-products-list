import { useRef, type FormEvent, type ReactNode } from 'react'
import type { AnyFormGroupApi } from '@tanstack/react-form'
import { STEP_FORM_ID } from './form-options'

interface StepFormProps {
  group: AnyFormGroupApi
  children?: ReactNode
}

export function StepForm({ group, children }: StepFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    for (const field of group.getRelatedFields()) {
      field.setMeta((meta) => ({ ...meta, isBlurred: true }))
    }
    await group.handleSubmit()
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
