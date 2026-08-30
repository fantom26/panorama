import { describe, expect, jest, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: unknown; children: React.ReactNode }) => (
    <a href={String(href)}>{children}</a>
  )
}))

jest.mock('@/i18n', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

jest.mock('@repo/ui', () => {
  const { createElement, cloneElement, isValidElement } =
    jest.requireActual<typeof import('react')>('react')
  type Props = Record<string, unknown> & { children?: React.ReactNode }
  return {
    Typography: ({ children, component = 'span', ...rest }: Props) =>
      createElement(component as React.ElementType, rest, children),
    Button: ({ children, render: renderProp }: Props & { render?: React.ReactNode }) =>
      isValidElement(renderProp)
        ? cloneElement(renderProp, {}, children)
        : createElement('button', { type: 'button' }, children)
  }
})

import NotFound from './not-found'

describe('NotFound', () => {
  test('renders the labelled 404 shell with a link home', () => {
    render(<NotFound />)

    expect(screen.getByRole('main')).toHaveAccessibleName('errors.notFound.pageLabel')
    expect(screen.getByRole('heading', { name: 'errors.notFound.title' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'errors.notFound.backHome' })).toHaveAttribute(
      'href',
      '/'
    )
  })
})
