'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import clsx from 'clsx'
import { useDebounceValue } from 'usehooks-ts'

import { Dialog, Flag, Icon, Skeleton, Typography } from '@repo/ui'

import { useTranslation } from '@/i18n'
import type { CountryRow } from '@/shared/api/statistics-api'
import { useCountries } from '@/shared/hooks/useCountries'
import { ROUTES } from '@/shared/routes'

import { filterCountries, moveActiveIndex } from './country-search'
import styles from './index.module.css'

const OPTION_ID = (id: string) => `country-search-option-${id}`

export default function CountrySearch() {
  const { t } = useTranslation('global')
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  // Input stays immediate; the filter over ~200 rows runs at most every 150ms.
  const [debouncedQuery, setDebouncedQuery] = useDebounceValue('', 150)
  const [activeIndex, setActiveIndex] = useState(0)

  const { countries, isLoading, isError } = useCountries(open)
  const results = useMemo(
    () => filterCountries(countries, debouncedQuery),
    [countries, debouncedQuery]
  )

  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  itemRefs.current.length = results.length

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!open) {
      setQuery('')
      setDebouncedQuery('')
    }
  }, [open, setDebouncedQuery])

  // Keep the highlight on the first row as the result set changes.
  useEffect(() => {
    setActiveIndex(0)
  }, [debouncedQuery])

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, Math.max(results.length - 1, 0)))
  }, [results.length])

  // Follow the keyboard highlight with the scroll position.
  useEffect(() => {
    itemRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  function goToCountry(country: CountryRow) {
    router.push(ROUTES.country(country.id))
    setOpen(false)
  }

  function handleListKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => moveActiveIndex(index, 1, results.length))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => moveActiveIndex(index, -1, results.length))
    } else if (event.key === 'Enter') {
      const country = results[activeIndex]
      if (country) {
        event.preventDefault()
        goToCountry(country)
      }
    }
  }

  const placeholder = t('search.placeholder')
  const showResults = !isLoading && !isError

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={styles.trigger} aria-label={placeholder}>
        <span className={styles.adornment} aria-hidden='true'>
          <Icon name='search' />
        </span>
        <Typography
          component='span'
          variant='body-sm'
          color='subtle'
          className={styles.placeholder}
        >
          {placeholder}
        </Typography>
        <span className={styles.shortcut} aria-hidden='true'>
          {t('search.shortcutHint')}
        </span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup
          className={styles.popup}
          aria-label={placeholder}
          onKeyDown={handleListKeyDown}
        >
          <Dialog.Title className={styles.srOnly}>{placeholder}</Dialog.Title>

          <div className={styles.header}>
            <span className={styles.adornment} aria-hidden='true'>
              <Icon name='search' />
            </span>
            <input
              className={styles.input}
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setDebouncedQuery(event.target.value)
              }}
              placeholder={placeholder}
              role='combobox'
              aria-expanded='true'
              aria-controls='country-search-list'
              aria-activedescendant={
                showResults && results[activeIndex] ? OPTION_ID(results[activeIndex].id) : undefined
              }
            />
            {showResults && (
              <Typography
                component='span'
                variant='meta-sm'
                color='subtle'
                className={styles.count}
              >
                {t('search.resultsCount', { count: results.length })}
              </Typography>
            )}
          </div>

          <ul
            id='country-search-list'
            role='listbox'
            aria-label={placeholder}
            className={styles.results}
          >
            {isLoading &&
              Array.from({ length: 8 }).map((_, index) => (
                <li key={index} className={styles.row}>
                  <Skeleton variant='rectangular' width='100%' height={20} />
                </li>
              ))}

            {isError && (
              <li className={styles.state}>
                <Typography variant='body-sm' color='subtle'>
                  {t('search.error')}
                </Typography>
              </li>
            )}

            {showResults && results.length === 0 && (
              <li className={styles.state}>
                <Typography variant='body-sm' color='subtle'>
                  {t('search.empty')}
                </Typography>
              </li>
            )}

            {showResults &&
              results.map((country, index) => (
                <li
                  key={country.id}
                  id={OPTION_ID(country.id)}
                  role='option'
                  aria-selected={index === activeIndex}
                  ref={(element) => {
                    itemRefs.current[index] = element
                  }}
                >
                  <Link
                    href={ROUTES.country(country.id)}
                    className={clsx(styles.row, index === activeIndex && styles.rowActive)}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setOpen(false)}
                  >
                    <Flag code={country.iso2} className={styles.flag} />
                    <span className={styles.text}>
                      <Typography component='span' variant='body-sm'>
                        {country.name}
                      </Typography>
                      <Typography component='span' variant='meta-sm' color='subtle'>
                        {country.region}
                      </Typography>
                    </span>
                    {index === activeIndex && (
                      <span className={styles.enter} aria-hidden='true'>
                        ↵
                      </span>
                    )}
                  </Link>
                </li>
              ))}
          </ul>

          <div className={styles.footer} aria-hidden='true'>
            <span>{t('search.hints')}</span>
            <span>{t('search.brand')}</span>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
