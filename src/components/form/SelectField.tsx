import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFieldContext, useFieldErrorState } from './form-context'

interface SelectFieldProps {
  label: string
  options: readonly string[]
  placeholder?: string
  getOptionLabel?: (option: string) => string
  className?: string
}

export function SelectField({
  label,
  options,
  placeholder,
  getOptionLabel = (option) => option,
  className,
}: SelectFieldProps) {
  const field = useFieldContext<string>()
  const { isInvalid, errors, errorId, describedBy } = useFieldErrorState()

  return (
    <Field data-invalid={isInvalid} className={className}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Select
        name={field.name}
        value={field.state.value}
        onValueChange={field.handleChange}
        // The trigger loses focus to the popup, so treat closing the popup as "blur".
        onOpenChange={(open) => !open && field.handleBlur()}
      >
        <SelectTrigger
          id={field.name}
          aria-invalid={isInvalid}
          aria-describedby={describedBy}
          className="w-full"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {getOptionLabel(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError id={errorId} errors={errors} />
    </Field>
  )
}
