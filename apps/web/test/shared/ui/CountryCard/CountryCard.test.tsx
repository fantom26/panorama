import { describe, expect, jest, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className }: Record<string, unknown>) => (
    <a href={String(href)} className={className as string}>
      {children as React.ReactNode}
    </a>
  )
}))

jest.mock('@repo/ui', () => {
  const { createElement } = jest.requireActual<typeof import('react')>('react')
  type Props = Record<string, unknown> & { children?: React.ReactNode }
  return {
    Flag: ({ code }: Props) => createElement('span', { 'data-flag': code }),
    Typography: ({ children, component = 'span', ...rest }: Props) =>
      createElement(component as React.ElementType, rest, children)
  }
})

import CountryCard from '@/shared/ui/CountryCard'

describe('CountryCard', () => {
  test('links to the country and renders flag + metric pairs', () => {
    render(
      <CountryCard
        id='DEU'
        iso2='de'
        name='Germany'
        metrics={[
          { label: 'Population', value: '84M' },
          { label: 'GDP', value: '$4.5T' }
        ]}
      />
    )

    expect(screen.getByRole('link', { name: /Germany/ })).toHaveAttribute('href', '/countries/DEU')
    expect(document.querySelector('[data-flag="de"]')).not.toBeNull()
    expect(screen.getByText('Population')).toBeInTheDocument()
    expect(screen.getByText('84M')).toBeInTheDocument()
    expect(screen.getByText('$4.5T')).toBeInTheDocument()
  })
})
