import { createFormHookContexts } from '@tanstack/react-form'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

/** Errors are shown once the user has left the field or tried to submit the step. */
export function useFieldErrorState() {
  const field = useFieldContext<unknown>()
  const { isTouched, isValid, errors } = field.state.meta
  const isInvalid = isTouched && !isValid

  return { isInvalid, errors: isInvalid ? errors.slice(0, 1) : [] }
}
