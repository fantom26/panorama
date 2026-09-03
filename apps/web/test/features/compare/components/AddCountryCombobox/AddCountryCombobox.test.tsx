import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { CountryOption } from '@/features/compare/model/country-options'

jest.mock('@/i18n', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { max?: number }) =>
      options?.max != null ? `${key}:${options.max}` : key
  })
}))

jest.mock('@/shared/store/compare', () => ({ MAX_COMPARE: 5 }))

// Stand-ins so jsdom never loads the real @repo/ui barrel (it re-exports amCharts).
// The Combobox stub models the parts of Base UI's open/select flow this component
// relies on: the popup shows only while `open`, an outside press closes it, and a
// pick closes it unless `onValueChange` cancels the event details.
jest.mock('@repo/ui', () => {
  const react = jest.requireActual<typeof import('react')>('react')
  const { createContext, useContext, createElement } = react

  type Details = { reason: string; cancel: () => void; readonly isCanceled: boolean }
  type Ctx = {
    items: { added?: boolean }[]
    disabled?: boolean
    open?: boolean
    onOpenChange?: (open: boolean, details: { reason: string }) => void
    onValueChange?: (value: unknown, details: Details) => void
  }
  const ComboboxContext = createContext<Ctx>({ items: [] })

  type Props = Record<string, unknown> & { children?: React.ReactNode }

  return {
    Flag: ({ code }: { code: string }) => createElement('span', { 'data-flag': code }),
    Skeleton: () => createElement('span', { 'data-testid': 'skeleton' }),
    Typography: ({
      children,
      component = 'span',
      ...rest
    }: Props & { children?: React.ReactNode }) =>
      createElement(component as React.ElementType, rest, children),
    Combobox: {
      Root: ({ items, disabled, open, onOpenChange, onValueChange, children }: Props & Ctx) =>
        createElement(
          ComboboxContext.Provider,
          { value: { items, disabled, open, onOpenChange, onValueChange } },
          createElement('button', {
            type: 'button',
            'data-testid': 'outside',
            onClick: () => onOpenChange?.(false, { reason: 'outside-press' })
          }),
          children
        ),
      Input: (props: Props) => {
        const { onOpenChange } = useContext(ComboboxContext)
        return createElement('input', {
          role: 'combobox',
          ...props,
          onFocus: () => onOpenChange?.(true, { reason: 'input-press' })
        })
      },
      Portal: ({ children }: Props) => createElement(react.Fragment, null, children),
      Positioner: ({ children }: Props) => createElement('div', null, children),
      Popup: ({ children }: Props) => {
        const { open } = useContext(ComboboxContext)
        return open ? createElement('div', null, children) : null
      },
      List: ({ children }: { children: (item: unknown, index: number) => React.ReactNode }) => {
        const { items } = useContext(ComboboxContext)
        return createElement(
          'div',
          null,
          items.map((item, index) => children(item, index))
        )
      },
      Item: ({ value, disabled, children }: Props & { value: unknown; disabled?: boolean }) => {
        const ctx = useContext(ComboboxContext)
        return createElement(
          'div',
          {
            role: 'option',
            'aria-disabled': Boolean(disabled),
            onClick: () => {
              if (disabled || ctx.disabled) return
              let canceled = false
              const details: Details = {
                reason: 'item-press',
                cancel: () => {
                  canceled = true
                },
                get isCanceled() {
                  return canceled
                }
              }
              ctx.onValueChange?.(value, details)
              if (!canceled) ctx.onOpenChange?.(false, { reason: 'item-press' })
            }
          },
          children
        )
      },
      Empty: ({ children }: Props) => {
        const { items } = useContext(ComboboxContext)
        return items.length === 0 ? createElement('div', null, children) : null
      }
    }
  }
})

import AddCountryCombobox from '@/features/compare/components/AddCountryCombobox'

const OPTIONS: CountryOption[] = [
  { value: 'BRA', label: 'Brazil', iso2: 'br', added: false },
  { value: 'DEU', label: 'Germany', iso2: 'de', added: true },
  { value: 'GHA', label: 'Ghana', iso2: 'gh', added: false }
]

const onAdd = jest.fn()

async function renderOpen(
  overrides: Partial<React.ComponentProps<typeof AddCountryCombobox>> = {}
) {
  const utils = render(
    <AddCountryCombobox
      options={OPTIONS}
      isLoading={false}
      isError={false}
      isFull={false}
      onAdd={onAdd}
      {...overrides}
    />
  )
  await userEvent.click(screen.getByRole('combobox'))
  return utils
}

beforeEach(() => {
  onAdd.mockClear()
})

describe('AddCountryCombobox', () => {
  test('lists a row per country once opened', async () => {
    await renderOpen()

    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      expect.stringContaining('Brazil'),
      expect.stringContaining('Germany'),
      expect.stringContaining('Ghana')
    ])
  })

  test('marks already-added countries as disabled with an "Added" label', async () => {
    await renderOpen()

    const germany = screen.getByRole('option', { name: /Germany/ })
    expect(germany).toHaveAttribute('aria-disabled', 'true')
    expect(germany).toHaveTextContent('add.added')
  })

  test('picking a country calls onAdd with its alpha-3 code', async () => {
    await renderOpen()

    await userEvent.click(screen.getByRole('option', { name: /Ghana/ }))

    expect(onAdd).toHaveBeenCalledWith('GHA')
  })

  test('picking a country keeps the popup open for the next add', async () => {
    await renderOpen()

    await userEvent.click(screen.getByRole('option', { name: /Ghana/ }))

    expect(screen.getByRole('option', { name: /Brazil/ })).toBeInTheDocument()
  })

  test('an outside press closes the popup', async () => {
    await renderOpen()
    expect(screen.getByRole('option', { name: /Brazil/ })).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('outside'))

    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })

  test('picking an already-added country does nothing', async () => {
    await renderOpen()

    await userEvent.click(screen.getByRole('option', { name: /Germany/ }))

    expect(onAdd).not.toHaveBeenCalled()
  })

  test('when full, the input shows the "remove one" hint and picks are inert', async () => {
    await renderOpen({ isFull: true })

    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'add.placeholderFull:5')

    await userEvent.click(screen.getByRole('option', { name: /Ghana/ }))
    expect(onAdd).not.toHaveBeenCalled()
  })

  test('surfaces an error state when the catalog fails to load', async () => {
    await renderOpen({ options: [], isError: true })

    expect(screen.getByText('add.error')).toBeInTheDocument()
  })

  test('shows loading placeholders while the catalog loads', async () => {
    await renderOpen({ options: [], isLoading: true })

    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })
})
