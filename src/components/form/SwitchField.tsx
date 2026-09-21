import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { useFieldContext, useFieldErrorState } from './form-context'

interface SwitchFieldProps {
  label: string
  className?: string
}

export function SwitchField({ label, className }: SwitchFieldProps) {
  const field = useFieldContext<boolean>()
  const { isInvalid, errors, errorId, describedBy } = useFieldErrorState()

  return (
    <Field orientation="horizontal" data-invalid={isInvalid} className={className}>
      <Switch
        id={field.name}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={field.handleChange}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        aria-describedby={describedBy}
      />
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <FieldError id={errorId} errors={errors} />
    </Field>
  )
}
