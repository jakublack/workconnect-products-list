import { createFormHookContexts } from '@tanstack/react-form'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

/**
 * Errors are shown only once the field was left (or its step submitted, see `StepForm`),
 * so the user isn't interrupted while still typing.
 */
export function useFieldErrorState() {
  const field = useFieldContext<unknown>()
  const { isBlurred, isValid, errors } = field.state.meta
  const isInvalid = isBlurred && !isValid

  return { isInvalid, errors: isInvalid ? errors.slice(0, 1) : [] }
}
