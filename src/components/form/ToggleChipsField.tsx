import { Field, FieldError, FieldTitle } from '@/components/ui/field'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useFieldContext, useFieldErrorState } from './form-context'

interface ToggleChipsFieldProps {
  label: string
  options: readonly string[]
  className?: string
}

export function ToggleChipsField({ label, options, className }: ToggleChipsFieldProps) {
  const field = useFieldContext<string[]>()
  const { isInvalid, errors, errorId, describedBy } = useFieldErrorState()
  const labelId = `${field.name}-label`

  return (
    <Field data-invalid={isInvalid} className={className}>
      <FieldTitle id={labelId}>{label}</FieldTitle>
      <ToggleGroup
        type="multiple"
        variant="outline"
        spacing={2}
        value={field.state.value}
        onValueChange={(value) => {
          field.handleChange(value)
          field.handleBlur()
        }}
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-invalid={isInvalid}
        className="flex-wrap"
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option}
            value={option}
            className="h-6 min-w-0 rounded-full px-2 font-normal text-muted-foreground aria-invalid:border-destructive data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
            aria-invalid={isInvalid}
          >
            {option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <FieldError id={errorId} errors={errors} />
    </Field>
  )
}
