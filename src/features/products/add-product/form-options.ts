import { defaultValidationLogic, formOptions, type ValidationLogicFn } from '@tanstack/react-form'
import { DEFAULT_VALUES } from './schema'

const validateOnChangeAndBlur: ValidationLogicFn = (props) =>
  defaultValidationLogic(
    props.event.type === 'blur' ? { ...props, event: { ...props.event, type: 'change' } } : props,
  )

export const addProductFormOptions = formOptions({
  defaultValues: DEFAULT_VALUES,
  validationLogic: validateOnChangeAndBlur,
})

export const STEP_FORM_ID = 'add-product-step'
