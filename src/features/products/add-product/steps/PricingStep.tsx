import { useRef } from 'react'
import { withForm } from '@/components/form/app-form'
import { CURRENCIES, VAT_RATES } from '../../data/options'
import { addProductFormOptions } from '../form-options'
import { formatAmount, grossToNet, netToGross, parseAmount } from '../pricing'
import { pricingSchema } from '../schema'
import { StepForm } from '../StepForm'

type PriceSource = 'net' | 'gross'

const VAT_OPTIONS = VAT_RATES.map(String)

export const PricingStep = withForm({
  ...addProductFormOptions,
  props: {} as { onNext: () => void },
  render: function PricingStep({ form, onNext }) {
    // The price the user typed last stays as is; a VAT change recalculates the other one.
    const lastEditedRef = useRef<PriceSource>('net')

    const syncPrices = (source: PriceSource) => {
      const vatRate = Number(form.getFieldValue('pricing.vatRate'))
      const [from, to, convert] =
        source === 'net'
          ? (['pricing.netPrice', 'pricing.grossPrice', netToGross] as const)
          : (['pricing.grossPrice', 'pricing.netPrice', grossToNet] as const)
      const amount = parseAmount(form.getFieldValue(from))

      form.setFieldValue(to, amount === null ? '' : formatAmount(convert(amount, vatRate)), {
        // Don't bounce back into the other field's listener, and don't mark it as touched.
        dontRunListeners: true,
        dontUpdateMeta: true,
      })
    }

    const handlePriceChange = (source: PriceSource) => () => {
      lastEditedRef.current = source
      syncPrices(source)
    }

    return (
      <form.FormGroup
        name="pricing"
        validators={{ onChange: pricingSchema }}
        onGroupSubmit={onNext}
      >
        {(group) => (
          <StepForm group={group}>
            <div className="grid gap-4 sm:grid-cols-2">
              <form.AppField
                name="pricing.netPrice"
                listeners={{ onChange: handlePriceChange('net') }}
              >
                {(field) => (
                  <field.TextField label="Cena netto" placeholder="0.00" inputMode="decimal" />
                )}
              </form.AppField>
              <form.AppField
                name="pricing.grossPrice"
                listeners={{ onChange: handlePriceChange('gross') }}
              >
                {(field) => (
                  <field.TextField label="Cena brutto" placeholder="0.00" inputMode="decimal" />
                )}
              </form.AppField>
              <form.AppField
                name="pricing.vatRate"
                listeners={{ onChange: () => syncPrices(lastEditedRef.current) }}
              >
                {(field) => (
                  <field.SelectField
                    label="Stawka VAT"
                    options={VAT_OPTIONS}
                    getOptionLabel={(rate) => `${rate}%`}
                  />
                )}
              </form.AppField>
              <form.AppField name="pricing.currency">
                {(field) => <field.SelectField label="Waluta" options={CURRENCIES} />}
              </form.AppField>
            </div>
          </StepForm>
        )}
      </form.FormGroup>
    )
  },
})
