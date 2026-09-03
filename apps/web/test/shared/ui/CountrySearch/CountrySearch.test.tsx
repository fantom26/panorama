import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush })
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: { href: unknown; children: React.ReactNode }) => (
    <a href={String(href)} {...rest}>
      {children}
    </a>
  )
}))

jest.mock('@/i18n', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { count?: number }) =>
      options?.count != null ? `${key}:${options.count}` : key
  })
}))

jest.mock('@/shared/hooks/useCountries', () => ({
  useCountries: () => ({
    countries: [
      { id: 'GHA', iso2: 'gh', name: 'Ghana', region: 'Africa' },
      { id: 'DEU', iso2: 'de', name: 'Germany', region: 'Europe' },
      { id: 'BRA', iso2: 'br', name: 'Brazil', region: 'Americas' },
      { id: 'GEO', iso2: 'ge', name: 'Georgia', region: 'Asia' }
    ],
    isLoading: false,
    isError: false
  })
}))

// Minimal stand-ins so jsdom never loads the real @repo/ui barrel (it re-exports amCharts).
jest.mock('@repo/ui', () => {
  const { createContext, useContext, createElement } =
    jest.requireActual<typeof import('react')>('react')

  const DialogContext = createContext<{ open: boolean; onOpenChange: (open: boolean) => void }>({
    open: false,
    onOpenChange: () => {}
  })

  type Props = Record<string, unknown>
  type RootProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
  }

  return {
    Dialog: {
      Root: ({ open, onOpenChange, children }: RootProps) =>
        createElement(DialogContext.Provider, { value: { open, onOpenChange } }, children),
      Trigger: (props: Props) => {
        const { onOpenChange } = useContext(DialogContext)
        return createElement('button', {
          type: 'button',
          ...props,
          onClick: () => onOpenChange(true)
        })
      },
      Portal: ({ children }: { children: React.ReactNode }) =>
        useContext(DialogContext).open ? children : null,
      Backdrop: () => null,
      Popup: (props: Props) => createElement('div', { role: 'dialog', ...props }),
      Title: (props: Props) => createElement('h2', props)
    },
    Icon: () => null,
    Skeleton: () => createElement('span', { 'data-testid': 'skeleton' }),
    Flag: ({ code }: { code: string }) => createElement('span', { 'data-flag': code }),
    Typography: ({
      children,
      component = 'span',
      ...rest
    }: Props & { children: React.ReactNode }) =>
      createElement(component as React.ElementType, rest, children)
  }
})

import CountrySearch from '@/shared/ui/CountrySearch'

beforeEach(() => {
  mockPush.mockClear()
})

async function open() {
  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: 'search.placeholder' }))
  return user
}

describe('CountrySearch', () => {
  test('renders the trigger and keeps the dialog closed until opened', () => {
    render(<CountrySearch />)

    expect(screen.getByRole('button', { name: 'search.placeholder' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('opens on trigger click and lists every country, sorted, with a result count', async () => {
    render(<CountrySearch />)
    await open()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    const options = screen.getAllByRole('option')
    expect(options.map((option) => option.textContent)).toEqual([
      expect.stringContaining('Brazil'),
      expect.stringContaining('Georgia'),
      expect.stringContaining('Germany'),
      expect.stringContaining('Ghana')
    ])
    expect(screen.getByText('search.resultsCount:4')).toBeInTheDocument()
  })

  test('filters the list as the user types', async () => {
    render(<CountrySearch />)
    const user = await open()

    await user.type(screen.getByRole('combobox'), 'geo')

    // The filter input is debounced (150ms), so the list settles asynchronously.
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1))
    expect(screen.getByRole('option')).toHaveTextContent('Georgia')
    expect(screen.getByText('search.resultsCount:1')).toBeInTheDocument()
  })

  test('arrow keys move the highlight and Enter navigates to that country', async () => {
    render(<CountrySearch />)
    const user = await open()

    await user.keyboard('{ArrowDown}{Enter}')

    expect(mockPush).toHaveBeenCalledWith('/countries/GEO')
  })

  test('each row links to the country page', async () => {
    render(<CountrySearch />)
    await open()

    expect(screen.getByRole('option', { name: /Germany/ }).querySelector('a')).toHaveAttribute(
      'href',
      '/countries/DEU'
    )
  })

  test('Cmd+K opens the palette from anywhere', async () => {
    render(<CountrySearch />)

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
    })

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })
})
