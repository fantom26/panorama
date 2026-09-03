import { describe, expect, jest, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'

jest.mock('@repo/ui', () => {
  const { createElement } = jest.requireActual<typeof import('react')>('react')
  type Props = Record<string, unknown>
  return {
    Breadcrumbs: ({ children }: Props) =>
      createElement('nav', { 'aria-label': 'Breadcrumb' }, children as never),
    Typography: ({ children, component, ...rest }: Props) =>
      createElement((component as string) ?? 'span', rest, children as never)
  }
})

jest.mock('@/shared/ui/AppHeader', () => {
  const { createElement } = jest.requireActual<typeof import('react')>('react')
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) =>
      createElement('header', null, children)
  }
})

jest.mock('@/shared/ui/ErrorBoundary', () => {
  const { createElement } = jest.requireActual<typeof import('react')>('react')
  return {
    __esModule: true,
    default: ({ children, onReset }: { children: React.ReactNode; onReset: () => void }) =>
      createElement(
        'div',
        { 'data-testid': 'error-boundary', 'data-has-reset': String(Boolean(onReset)) },
        children
      )
  }
})

import OverviewPageShell from '@/shared/ui/OverviewPageShell'

describe('OverviewPageShell', () => {
  function renderShell(props: Partial<React.ComponentProps<typeof OverviewPageShell>> = {}) {
    return render(
      <OverviewPageShell
        homeLabel='Global'
        crumb='South Asia'
        eyebrow='Region'
        title='South Asia'
        switcher={<button type='button'>switch</button>}
        onReset={() => {}}
        {...props}
      >
        <p>body</p>
      </OverviewPageShell>
    )
  }

  test('renders the home breadcrumb as a link and the current crumb with aria-current', () => {
    renderShell()

    expect(screen.getByRole('link', { name: 'Global' })).toHaveAttribute('href', '/')
    expect(
      screen.getByText('South Asia', { selector: '[aria-current="page"]' })
    ).toBeInTheDocument()
  })

  test('places eyebrow, title, switcher and the error-bounded body', () => {
    renderShell()

    expect(screen.getByText('Region')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'South Asia' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'switch' })).toBeInTheDocument()

    const boundary = screen.getByTestId('error-boundary')
    expect(boundary).toHaveAttribute('data-has-reset', 'true')
    expect(boundary).toContainElement(screen.getByText('body'))
  })

  test('renders the optional subtitle only when provided', () => {
    const { rerender } = renderShell()
    expect(screen.queryByText('42 economies')).not.toBeInTheDocument()

    rerender(
      <OverviewPageShell
        homeLabel='Global'
        crumb='High income'
        eyebrow='Income level'
        title='High income'
        subtitle={<span>42 economies</span>}
        switcher={<button type='button'>switch</button>}
        onReset={() => {}}
      >
        <p>body</p>
      </OverviewPageShell>
    )
    expect(screen.getByText('42 economies')).toBeInTheDocument()
  })
})
