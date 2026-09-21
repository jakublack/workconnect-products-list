import type { ComponentProps } from 'react'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useFieldContext, useFieldErrorState } from './form-context'

interface TextareaFieldProps extends Omit<ComponentProps<typeof Textarea>, 'value' | 'onChange'> {
  label: string
}

export function TextareaField({ label, className, ...textareaProps }: TextareaFieldProps) {
  const field = useFieldContext<string>()
  const { isInvalid, errors } = useFieldErrorState()

  return (
    <Field data-invalid={isInvalid} className={className}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        {...textareaProps}
      />
      <FieldError errors={errors} />
    </Field>
  )
}
