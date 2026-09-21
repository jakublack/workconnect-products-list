import { withForm } from '@/components/form/app-form'
import { CATEGORIES, FEATURES, MANUFACTURERS } from '../../data/options'
import { addProductFormOptions } from '../form-options'
import { basicInfoSchema } from '../schema'
import { StepForm } from '../StepForm'

export const BasicInfoStep = withForm({
  ...addProductFormOptions,
  props: {} as { onNext: () => void },
  render: function BasicInfoStep({ form, onNext }) {
    return (
      <form.FormGroup
        name="basicInfo"
        validators={{ onChange: basicInfoSchema }}
        onGroupSubmit={onNext}
      >
        {(group) => (
          <StepForm group={group}>
            <div className="grid gap-4 sm:grid-cols-2">
              <form.AppField name="basicInfo.name">
                {(field) => (
                  <field.TextField label="Nazwa produktu" placeholder="np. MacBook Pro 14" />
                )}
              </form.AppField>
              <form.AppField name="basicInfo.sku">
                {(field) => <field.TextField label="SKU produktu" placeholder="np. MBP14M3PRO" />}
              </form.AppField>
            </div>
            <form.AppField name="basicInfo.description">
              {(field) => <field.TextareaField label="Opis" placeholder="Krótki opis produktu" />}
            </form.AppField>
            <div className="grid gap-4 sm:grid-cols-2">
              <form.AppField name="basicInfo.manufacturer">
                {(field) => (
                  <field.SelectField
                    label="Producent"
                    placeholder="Wybierz producenta"
                    options={MANUFACTURERS}
                  />
                )}
              </form.AppField>
              <form.AppField name="basicInfo.category">
                {(field) => (
                  <field.SelectField
                    label="Kategoria"
                    placeholder="Wybierz kategorię"
                    options={CATEGORIES}
                  />
                )}
              </form.AppField>
            </div>
            <form.AppField name="basicInfo.features">
              {(field) => <field.ToggleChipsField label="Cechy produktu" options={FEATURES} />}
            </form.AppField>
          </StepForm>
        )}
      </form.FormGroup>
    )
  },
})
