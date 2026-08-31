import { describe, expect, jest, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'

jest.mock('@/i18n', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

jest.mock('@repo/ui', () => {
  const { createElement } = jest.requireActual<typeof import('react')>('react')
  type Props = Record<string, unknown> & { children?: React.ReactNode }
  return {
    Typography: ({ children, component = 'span', ...rest }: Props) =>
      createElement(component as React.ElementType, rest, children),
    Button: ({ children, onClick }: Props & { onClick?: () => void }) =>
      createElement('button', { type: 'button', onClick }, children)
  }
})

import ErrorBoundary from '@/shared/ui/ErrorBoundary'

function Boom(): React.ReactNode {
  throw new globalThis.Error('kaboom')
}

describe('ErrorBoundary', () => {
  test('renders the translated fallback when a child throws', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    )

    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(screen.getByText('errors.section.title')).toBeInTheDocument()
    expect(screen.getByText('errors.section.details')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.retry' })).toBeInTheDocument()
    expect(screen.getByText('kaboom')).toBeInTheDocument()

    consoleError.mockRestore()
  })
})
