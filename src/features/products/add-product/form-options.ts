import { defaultValidationLogic, formOptions, type ValidationLogicFn } from '@tanstack/react-form'
import { DEFAULT_VALUES } from './schema'

/**
 * Runs the steps' `onChange` validators on blur too: leaving a field validates it,
 * and errors stay current on every keystroke (whether they are *shown* is up to the field).
 */
const validateOnChangeAndBlur: ValidationLogicFn = (props) =>
  defaultValidationLogic(
    props.event.type === 'blur' ? { ...props, event: { ...props.event, type: 'change' } } : props,
  )

/** Shared by `useAppForm` and the `withForm` step components. */
export const addProductFormOptions = formOptions({
  defaultValues: DEFAULT_VALUES,
  validationLogic: validateOnChangeAndBlur,
})

/** Lets the dialog footer submit whichever step is currently rendered. */
export const STEP_FORM_ID = 'add-product-step'
