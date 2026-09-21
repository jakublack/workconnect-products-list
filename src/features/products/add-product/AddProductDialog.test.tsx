import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AddProductDialog } from './AddProductDialog'

function setup() {
  const user = userEvent.setup()
  const onProductAdd = vi.fn()
  render(<AddProductDialog onProductAdd={onProductAdd} />)
  return { user, onProductAdd }
}

const currentStep = () =>
  within(screen.getByRole('dialog')).getByRole('listitem', { current: 'step' })

const openDialog = (user: UserEvent) =>
  user.click(screen.getByRole('button', { name: 'Dodaj produkt' }))

const clickNext = (user: UserEvent) => user.click(screen.getByRole('button', { name: 'Dalej' }))

async function selectOption(user: UserEvent, label: string, option: string) {
  await user.click(screen.getByRole('combobox', { name: label }))
  await user.click(await screen.findByRole('option', { name: option }))
}

async function fillBasicInfo(user: UserEvent) {
  await user.type(screen.getByLabelText('Nazwa produktu'), 'Dell XPS 13')
  await user.type(screen.getByLabelText('SKU produktu'), 'DLXPS13')
  await selectOption(user, 'Producent', 'Dell')
  await selectOption(user, 'Kategoria', 'Komputery')
  await user.click(screen.getByRole('button', { name: 'WiFi' }))
}

describe('AddProductDialog', () => {
  it('does not leave step 1 until it is valid and points at the errors', async () => {
    const { user } = setup()
    await openDialog(user)

    await clickNext(user)

    expect(currentStep()).toHaveTextContent('Informacje')
    expect(screen.getByText('Podaj nazwę produktu')).toBeInTheDocument()
    expect(screen.getByText('Podaj SKU produktu')).toBeInTheDocument()
    expect(
      screen.getByText('Wybierz producenta', { selector: '[data-slot=field-error]' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Wybierz co najmniej jedną cechę')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByLabelText('Nazwa produktu')).toHaveFocus())
  })

  it('re-validates a field as the user types once the step was submitted', async () => {
    const { user } = setup()
    await openDialog(user)
    await clickNext(user)

    await user.type(screen.getByLabelText('Nazwa produktu'), 'ab')
    expect(screen.getByText('Nazwa musi mieć co najmniej 3 znaki')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Nazwa produktu'), 'c')
    expect(screen.queryByText('Nazwa musi mieć co najmniej 3 znaki')).not.toBeInTheDocument()
  })

  it('keeps the entered values when going back', async () => {
    const { user } = setup()
    await openDialog(user)
    await fillBasicInfo(user)
    await clickNext(user)
    expect(currentStep()).toHaveTextContent('Cena')
    await user.type(screen.getByLabelText('Cena netto'), '100')

    await user.click(screen.getByRole('button', { name: 'Wstecz' }))

    expect(currentStep()).toHaveTextContent('Informacje')
    expect(screen.getByLabelText('Nazwa produktu')).toHaveValue('Dell XPS 13')
    expect(screen.getByRole('combobox', { name: 'Producent' })).toHaveTextContent('Dell')
    expect(screen.getByRole('button', { name: 'WiFi' })).toHaveAttribute('aria-pressed', 'true')

    await clickNext(user)
    expect(screen.getByLabelText('Cena netto')).toHaveValue('100')
  })

  it('keeps net and gross prices in sync with the VAT rate', async () => {
    const { user } = setup()
    await openDialog(user)
    await fillBasicInfo(user)
    await clickNext(user)
    const net = screen.getByLabelText('Cena netto')
    const gross = screen.getByLabelText('Cena brutto')

    await user.type(net, '100')
    expect(gross).toHaveValue('123.00')

    await selectOption(user, 'Stawka VAT', '8%')
    expect(gross).toHaveValue('108.00')

    await user.clear(gross)
    await user.type(gross, '216')
    expect(net).toHaveValue('200.00')

    // The gross price was edited last, so a VAT change now recalculates the net price.
    await selectOption(user, 'Stawka VAT', '0%')
    expect(gross).toHaveValue('216')
    expect(net).toHaveValue('216.00')
  })

  it('goes back to an empty step 1 after closing', async () => {
    const { user } = setup()
    await openDialog(user)
    await fillBasicInfo(user)
    await clickNext(user)

    await user.click(screen.getByRole('button', { name: 'Zamknij' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await openDialog(user)

    expect(currentStep()).toHaveTextContent('Informacje')
    expect(screen.getByLabelText('Nazwa produktu')).toHaveValue('')
    expect(screen.queryByText('Podaj nazwę produktu')).not.toBeInTheDocument()
  })

  it('shows the stock field only for limited products', async () => {
    const { user } = setup()
    await openDialog(user)
    await fillBasicInfo(user)
    await clickNext(user)
    await user.type(screen.getByLabelText('Cena netto'), '100')
    await clickNext(user)
    expect(screen.queryByLabelText('Ilość na magazynie')).not.toBeInTheDocument()

    await user.click(screen.getByLabelText('Produkt limitowany'))
    await user.click(screen.getByRole('button', { name: 'Zapisz produkt' }))

    expect(screen.getByText('Podaj ilość na magazynie')).toBeInTheDocument()
    expect(currentStep()).toHaveTextContent('Dostępność')
  })

  it('saves the product and closes the dialog', async () => {
    const { user, onProductAdd } = setup()
    await openDialog(user)
    await fillBasicInfo(user)
    await clickNext(user)
    await user.type(screen.getByLabelText('Cena netto'), '5690,24')
    await clickNext(user)
    await user.click(screen.getByLabelText('Produkt limitowany'))
    await user.type(screen.getByLabelText('Ilość na magazynie'), '12')

    await user.click(screen.getByRole('button', { name: 'Zapisz produkt' }))

    expect(onProductAdd).toHaveBeenCalledOnce()
    expect(onProductAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Dell XPS 13',
        sku: 'DLXPS13',
        manufacturer: 'Dell',
        category: 'Komputery',
        features: ['WiFi'],
        netPrice: 5690.24,
        grossPrice: 6999,
        vatRate: 23,
        currency: 'PLN',
        isAvailable: true,
        stock: 12,
        minCartQuantity: 1,
        maxCartQuantity: 10,
      }),
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
