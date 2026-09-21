import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AddProductDialog } from './AddProductDialog'

// Simulates a failed download of the lazy form chunk (e.g. offline, or a newer deploy).
vi.mock('./AddProductForm', () => {
  throw new Error('Failed to fetch dynamically imported module')
})

describe('AddProductDialog when the form cannot be loaded', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows an error with a reload action instead of crashing the page', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const user = userEvent.setup()
    render(<AddProductDialog onProductAdd={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Dodaj produkt' }))

    expect(await screen.findByText('Nie udało się wczytać formularza.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Odśwież stronę' })).toBeInTheDocument()
    // The rest of the page is still there.
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
