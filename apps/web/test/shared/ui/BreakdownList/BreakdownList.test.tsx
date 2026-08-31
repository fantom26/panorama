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
    Typography: ({ children, component = 'span', ...rest }: Props) =>
      createElement(component as React.ElementType, rest, children)
  }
})

import BreakdownList from '@/shared/ui/BreakdownList'

describe('BreakdownList', () => {
  test('renders a link row when href is set and a plain row when it is not', () => {
    render(
      <BreakdownList
        rows={[
          {
            key: 'a',
            label: 'High income',
            sublabel: '/high',
            href: '/income/high',
            metrics: ['81 countries', 'Pop · 1.2B']
          },
          { key: 'b', label: 'Not classified', metrics: ['3 countries'] }
        ]}
      />
    )

    const link = screen.getByRole('link', { name: /High income/ })
    expect(link).toHaveAttribute('href', '/income/high')
    expect(screen.getByText('/high')).toBeInTheDocument()
    expect(screen.getByText('81 countries')).toBeInTheDocument()

    // the second row has no href → not a link
    expect(screen.queryByRole('link', { name: /Not classified/ })).toBeNull()
    expect(screen.getByText('Not classified')).toBeInTheDocument()
  })
})
