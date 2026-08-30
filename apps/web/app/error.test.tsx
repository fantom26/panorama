import { describe, expect, jest, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

import ErrorPage from './error'

describe('Error', () => {
  test('logs the error, renders the alert, and retries on click', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    const retry = jest.fn()
    const boom = new globalThis.Error('boom')

    render(<ErrorPage error={boom} retry={retry} />)

    expect(screen.getByRole('alert')).toHaveAccessibleName('errors.generic.title')
    expect(screen.getByRole('heading', { name: 'errors.generic.title' })).toBeInTheDocument()
    expect(consoleError).toHaveBeenCalledWith(boom)

    await userEvent.click(screen.getByRole('button', { name: 'actions.retry' }))
    expect(retry).toHaveBeenCalledTimes(1)

    consoleError.mockRestore()
  })
})
