'use client'

import { useEffect, useMemo, useRef } from 'react'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Breadcrumbs, Chip, Flag, Section, Skeleton, Typography } from '@repo/ui'

import AddCountryCombobox from '@/features/compare/components/AddCountryCombobox'
import CompareMatrix from '@/features/compare/components/CompareMatrix'
import { useCompareCountries } from '@/features/compare/hooks/useCompareCountries'
import { toCountryOptions } from '@/features/compare/model/country-options'
import { useTranslation } from '@/i18n'
import { useCountries } from '@/shared/hooks/useCountries'
import { ROUTES } from '@/shared/routes'
import {
  MAX_COMPARE,
  parseCompareParam,
  serializeCompareParam,
  useCompareList
} from '@/shared/store/compare'
import AppHeader from '@/shared/ui/AppHeader'
import TitleBlock from '@/shared/ui/TitleBlock'

import styles from './index.module.css'

export default function CompareView() {
  const { t } = useTranslation('compare')
  const { codes, set, remove, add, isFull, hydrated } = useCompareList()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { columns, isPending } = useCompareCountries(codes)

  // Warm the catalog on mount so the picker's list is ready on first open.
  const { countries, isLoading: countriesLoading, isError: countriesError } = useCountries()
  const countryOptions = useMemo(() => toCountryOptions(countries, codes), [countries, codes])

  // On first load, a shared `?countries=` link seeds the store; afterwards the store owns it.
  const seeded = useRef(false)
  useEffect(() => {
    if (!hydrated || seeded.current) return
    seeded.current = true

    const fromUrl = parseCompareParam(searchParams.get('countries'))
    if (fromUrl.length > 0) set(fromUrl)
  }, [hydrated, searchParams, set])

  // Keep the URL mirroring the store so the page stays shareable.
  useEffect(() => {
    if (!hydrated) return

    const next = serializeCompareParam(codes)
    if (next === (searchParams.get('countries') ?? '')) return

    router.replace(ROUTES.compare(codes), { scroll: false })
  }, [hydrated, codes, router, searchParams])

  return (
    <>
      <AppHeader>
        <Breadcrumbs>
          <Link href={ROUTES.home()}>
            <Typography variant='body-sm' color='muted' component='span'>
              {t('breadcrumb.global')}
            </Typography>
          </Link>
          <Typography variant='body-sm' color='knockout' component='span' aria-current='page'>
            {t('breadcrumb.compare')}
          </Typography>
        </Breadcrumbs>
      </AppHeader>

      <TitleBlock className={styles.titleBlock}>
        <div>
          <Typography variant='meta-sm' color='subtle' component='div'>
            {t('eyebrow', { count: codes.length, max: MAX_COMPARE })}
          </Typography>
          <Typography variant='headline-sm' component='h1'>
            {t('title')}
          </Typography>
        </div>
      </TitleBlock>

      {!hydrated ? (
        <Section title={t('sections.indicators')} className={styles.section}>
          <Skeleton variant='rectangular' width='100%' height={320} />
        </Section>
      ) : codes.length === 0 ? (
        <div className={styles.empty}>
          <Typography variant='title-default' component='p'>
            {t('empty.title')}
          </Typography>
          <Typography variant='body-sm' color='muted' component='p'>
            {t('empty.body')}
          </Typography>
          <AddCountryCombobox
            options={countryOptions}
            isLoading={countriesLoading}
            isError={countriesError}
            isFull={isFull}
            onAdd={add}
            variant='block'
          />
          <Link href={ROUTES.home()} className={styles.emptyCta}>
            <Typography variant='body-sm' component='span'>
              {t('empty.cta')}
            </Typography>
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.chips}>
            {columns.map((column) => (
              <Chip
                key={column.code}
                startIcon={column.country ? <Flag code={column.country.iso2} /> : undefined}
                label={column.country?.name ?? column.code}
                onDelete={() => remove(column.code)}
              />
            ))}
            <AddCountryCombobox
              options={countryOptions}
              isLoading={countriesLoading}
              isError={countriesError}
              isFull={isFull}
              onAdd={add}
            />
          </div>

          {codes.length === 1 && (
            <Typography variant='body-sm' color='muted' component='p' className={styles.singleHint}>
              {t('single.hint')}
            </Typography>
          )}

          <Section title={t('sections.indicators')} className={styles.section}>
            <CompareMatrix columns={columns} loading={isPending} />
          </Section>
        </>
      )}
    </>
  )
}
