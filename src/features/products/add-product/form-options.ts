import { formOptions, revalidateLogic } from '@tanstack/react-form'
import { DEFAULT_VALUES } from './schema'

/** Shared by `useAppForm` and the `withForm` step components. */
export const addProductFormOptions = formOptions({
  defaultValues: DEFAULT_VALUES,
  // Validate a field when it's left; after the first "Dalej" on a step, re-validate on every change.
  validationLogic: revalidateLogic({ mode: 'blur', modeAfterSubmission: 'change' }),
})

/** Lets the dialog footer submit whichever step is currently rendered. */
export const STEP_FORM_ID = 'add-product-step'
