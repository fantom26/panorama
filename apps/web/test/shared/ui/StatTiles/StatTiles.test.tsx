import { describe, expect, jest, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'

jest.mock('@repo/ui', () => {
  const { createElement } = jest.requireActual<typeof import('react')>('react')
  type Props = Record<string, unknown>
  return {
    StatCard: ({ label, value, loading }: Props) =>
      createElement('div', { 'data-testid': 'stat', 'data-loading': String(Boolean(loading)) }, [
        createElement('span', { key: 'l' }, label as string),
        createElement('span', { key: 'v' }, value as string)
      ])
  }
})

import StatTiles from '@/shared/ui/StatTiles'

const tiles = [
  { key: 'economies', value: '81' },
  { key: 'totalPopulation', value: '1.2B' }
]

describe('StatTiles', () => {
  test('renders one StatCard per tile with resolved labels and forwarded loading', () => {
    render(<StatTiles tiles={tiles} labelFor={(key) => `label.${key}`} loading />)

    const cards = screen.getAllByTestId('stat')
    expect(cards).toHaveLength(2)
    expect(screen.getByText('label.economies')).toBeInTheDocument()
    expect(screen.getByText('81')).toBeInTheDocument()
    expect(cards[0]).toHaveAttribute('data-loading', 'true')
  })

  test('column count drives the grid modifier class', () => {
    const { container, rerender } = render(<StatTiles tiles={tiles} labelFor={(k) => k} />)
    expect(container.querySelector('.stats')).toHaveClass('cols5')

    rerender(<StatTiles tiles={tiles} labelFor={(k) => k} columns={4} />)
    expect(container.querySelector('.stats')).toHaveClass('cols4')
  })
})
