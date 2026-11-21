'use client'

import { useState } from 'react'

import clsx from 'clsx'

import { Combobox, Flag, Skeleton, Typography } from '@repo/ui'

import type { CountryOption } from '@/features/compare/model/country-options'
import { useTranslation } from '@/i18n'
import { MAX_COMPARE } from '@/shared/store/compare'
import type { Alpha3Code } from '@/shared/types/iso'

import styles from './index.module.css'

const LOADING_ROWS = 6

export type AddCountryComboboxProps = {
  options: CountryOption[]
  isLoading: boolean
  isError: boolean
  isFull: boolean
  onAdd: (code: Alpha3Code) => void
  variant?: 'inline' | 'block'
}

export default function AddCountryCombobox({
  options,
  isLoading,
  isError,
  isFull,
  onAdd,
  variant = 'inline'
}: AddCountryComboboxProps) {
  const { t } = useTranslation('compare')
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const disabled = isFull || isError
  const placeholder = isFull ? t('add.placeholderFull', { max: MAX_COMPARE }) : t('add.placeholder')

  return (
    <Combobox.Root<CountryOption>
      items={options}
      value={null}
      inputValue={query}
      onInputValueChange={setQuery}
      open={open}
      onOpenChange={setOpen}
      onValueChange={(option, details) => {
        if (!option) return
        onAdd(option.value)
        setQuery('')
        // Cancel the selection so Base UI keeps the popup open (and its open state
        // in sync) — several countries can be added without reopening it, while an
        // outside click or Escape still closes it.
        details.cancel()
      }}
      disabled={disabled}
      autoHighlight
      modal={false}
    >
      <div className={clsx(styles.field, styles[variant])}>
        <Combobox.Input placeholder={placeholder} aria-label={t('add.label')} />
      </div>

      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup>
            <Combobox.List>
              {(option: CountryOption) => (
                <Combobox.Item key={option.value} value={option} disabled={option.added}>
                  <Flag code={option.iso2} className={styles.flag} />
                  <Typography variant='body-sm' component='span' className={styles.name}>
                    {option.label}
                  </Typography>
                  {option.added && (
                    <Typography
                      variant='meta-sm'
                      color='subtle'
                      component='span'
                      className={styles.added}
                    >
                      {t('add.added')}
                    </Typography>
                  )}
                </Combobox.Item>
              )}
            </Combobox.List>

            <Combobox.Empty>
              {isError
                ? t('add.error')
                : isLoading
                  ? Array.from({ length: LOADING_ROWS }).map((_, index) => (
                      <Skeleton key={index} variant='rectangular' width='100%' height={20} />
                    ))
                  : t('add.empty')}
            </Combobox.Empty>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  )
}
