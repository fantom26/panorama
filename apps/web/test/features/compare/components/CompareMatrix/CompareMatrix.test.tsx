import { describe, expect, jest, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'

import type { CompareColumn } from '@/features/compare/hooks/useCompareCountries'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: { href: unknown; children: React.ReactNode }) => (
    <a href={String(href)} {...rest}>
      {children}
    </a>
  )
}))

jest.mock('@/i18n', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}))

jest.mock('@repo/ui', () => {
  const { createElement } = jest.requireActual<typeof import('react')>('react')
  type Props = Record<string, unknown>
  return {
    Flag: ({ code }: { code: string }) => createElement('span', { 'data-flag': code }),
    Skeleton: () => createElement('span', { 'data-testid': 'skeleton' }),
    Typography: ({
      children,
      component = 'span',
      ...rest
    }: Props & { children?: React.ReactNode }) =>
      createElement(component as React.ElementType, rest, children)
  }
})

import CompareMatrix from '@/features/compare/components/CompareMatrix'

const loaded = {
  code: 'DEU',
  country: { id: 'DEU', iso2: 'de', name: 'Germany', region: 'Europe' },
  stats: null,
  isPending: false,
  isError: false
} as unknown as CompareColumn

const pending = {
  code: 'FRA',
  country: null,
  stats: null,
  isPending: true,
  isError: false
} as unknown as CompareColumn

describe('CompareMatrix column headers', () => {
  test('a loaded column links its header to the country detail page', () => {
    render(<CompareMatrix columns={[loaded]} />)

    const link = screen.getByRole('link', { name: /Germany/ })
    expect(link).toHaveAttribute('href', '/countries/DEU')
  })

  test('a pending column renders no header link', () => {
    render(<CompareMatrix columns={[pending]} />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getAllByText('FRA').length).toBeGreaterThan(0)
  })
})
