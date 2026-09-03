import { Children } from 'react'

import { describe, expect, jest, test } from '@jest/globals'

type CookieStore = { get: (name: string) => { value: string } | undefined }

const cookieStore: CookieStore = { get: () => undefined }
jest.mock('next/headers', () => ({ cookies: () => Promise.resolve(cookieStore) }))

import RootLayout from '@app/layout'

import { LOCALE_COOKIE_KEY, THEME_COOKIE_KEY } from '@/shared/utils/cookies'

type BodyElement = React.ReactElement<{
  children: React.ReactElement<{ children: React.ReactElement<{ theme: string; locale: string }> }>
}>

type HtmlElement = React.ReactElement<{
  lang: string
  dir: string
  'data-theme': string
  children: React.ReactNode
}>

function providersProps(html: HtmlElement) {
  const children = Children.toArray(html.props.children) as React.ReactElement[]
  const body = children.find((child) => child.type === 'body') as BodyElement
  return body.props.children.props
}

describe('RootLayout', () => {
  test('renders light/en/ltr when no cookies are set, and passes the same values to Providers', async () => {
    cookieStore.get = () => undefined

    const html = (await RootLayout({ children: null })) as HtmlElement

    expect(html.props.lang).toBe('en')
    expect(html.props.dir).toBe('ltr')
    expect(html.props['data-theme']).toBe('light')
    expect(providersProps(html)).toMatchObject({ theme: 'light', locale: 'en' })
  })

  test('renders dark/ar/rtl when cookies say so, and passes the same values to Providers', async () => {
    cookieStore.get = (name) => {
      if (name === THEME_COOKIE_KEY) return { value: 'dark' }
      if (name === LOCALE_COOKIE_KEY) return { value: 'ar' }
      return undefined
    }

    const html = (await RootLayout({ children: null })) as HtmlElement

    expect(html.props.lang).toBe('ar')
    expect(html.props.dir).toBe('rtl')
    expect(html.props['data-theme']).toBe('dark')
    expect(providersProps(html)).toMatchObject({ theme: 'dark', locale: 'ar' })
  })

  test('falls back to light/en for a garbage cookie value', async () => {
    cookieStore.get = () => ({ value: 'neon' })

    const html = (await RootLayout({ children: null })) as HtmlElement

    expect(html.props.lang).toBe('en')
    expect(html.props.dir).toBe('ltr')
    expect(html.props['data-theme']).toBe('light')
    expect(providersProps(html)).toMatchObject({ theme: 'light', locale: 'en' })
  })
})
