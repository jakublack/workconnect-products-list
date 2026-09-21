import { createFormHookContexts } from '@tanstack/react-form'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export function useFieldErrorState() {
  const field = useFieldContext<unknown>()
  const { isBlurred, isValid, errors } = field.state.meta
  const isInvalid = isBlurred && !isValid
  const errorId = `${field.name}-error`

  return {
    isInvalid,
    errors: isInvalid ? errors.slice(0, 1) : [],
    errorId,
    describedBy: isInvalid ? errorId : undefined,
  }
}
