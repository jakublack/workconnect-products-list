import { createFormHook } from '@tanstack/react-form'
import { CheckboxField } from './CheckboxField'
import { fieldContext, formContext } from './form-context'
import { SelectField } from './SelectField'
import { SwitchField } from './SwitchField'
import { TextareaField } from './TextareaField'
import { TextField } from './TextField'
import { ToggleChipsField } from './ToggleChipsField'

/** TanStack Form bound to our shadcn/ui field components (`<form.AppField>` → `field.TextField`). */
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
    ToggleChipsField,
    SwitchField,
    CheckboxField,
  },
  formComponents: {},
})
