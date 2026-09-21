import { withForm } from '@/components/form/app-form'
import { FieldLegend, FieldSet } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import { addProductFormOptions } from '../form-options'
import { availabilitySchema } from '../schema'
import { StepForm } from '../StepForm'

export const AvailabilityStep = withForm({
  ...addProductFormOptions,
  props: {} as { onSubmit: () => void },
  render: function AvailabilityStep({ form, onSubmit }) {
    return (
      <form.FormGroup
        name="availability"
        validators={{ onChange: availabilitySchema }}
        onGroupSubmit={onSubmit}
      >
        {(group) => (
          <StepForm group={group}>
            <form.AppField name="availability.isAvailable">
              {(field) => <field.SwitchField label="Produkt jest dostępny" />}
            </form.AppField>
            <Separator />
            <form.AppField name="availability.isLimited">
              {(field) => <field.CheckboxField label="Produkt limitowany" />}
            </form.AppField>
            <form.Subscribe selector={(state) => state.values.availability.isLimited}>
              {(isLimited) =>
                isLimited && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <form.AppField name="availability.stock">
                      {(field) => (
                        <field.TextField
                          label="Ilość na magazynie"
                          placeholder="0"
                          inputMode="numeric"
                        />
                      )}
                    </form.AppField>
                  </div>
                )
              }
            </form.Subscribe>
            <Separator />
            <FieldSet>
              <FieldLegend className="mb-4">Limity koszyka</FieldLegend>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.AppField name="availability.minQuantity">
                  {(field) => <field.TextField label="Minimalna ilość" inputMode="numeric" />}
                </form.AppField>
                <form.AppField name="availability.maxQuantity">
                  {(field) => <field.TextField label="Maksymalna ilość" inputMode="numeric" />}
                </form.AppField>
              </div>
            </FieldSet>
          </StepForm>
        )}
      </form.FormGroup>
    )
  },
})
