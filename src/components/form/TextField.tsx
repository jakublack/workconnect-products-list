import type { ComponentProps } from 'react'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useFieldContext, useFieldErrorState } from './form-context'

interface TextFieldProps extends Omit<ComponentProps<typeof Input>, 'value' | 'onChange'> {
  label: string
}

export function TextField({ label, className, ...inputProps }: TextFieldProps) {
  const field = useFieldContext<string>()
  const { isInvalid, errors } = useFieldErrorState()

  return (
    <Field data-invalid={isInvalid} className={className}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        {...inputProps}
      />
      <FieldError errors={errors} />
    </Field>
  )
}
