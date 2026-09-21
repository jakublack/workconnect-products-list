import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { useFieldContext, useFieldErrorState } from './form-context'

interface CheckboxFieldProps {
  label: string
  className?: string
}

export function CheckboxField({ label, className }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>()
  const { isInvalid, errors, errorId, describedBy } = useFieldErrorState()

  return (
    <Field orientation="horizontal" data-invalid={isInvalid} className={className}>
      <Checkbox
        id={field.name}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked === true)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        aria-describedby={describedBy}
      />
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <FieldError id={errorId} errors={errors} />
    </Field>
  )
}
