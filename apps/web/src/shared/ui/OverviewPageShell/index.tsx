import Link from 'next/link'

import { Breadcrumbs, Typography } from '@repo/ui'

import { ROUTES } from '@/shared/routes'
import AppHeader from '@/shared/ui/AppHeader'
import ErrorBoundary from '@/shared/ui/ErrorBoundary'
import TitleBlock from '@/shared/ui/TitleBlock'
import TitleMeta from '@/shared/ui/TitleMeta'

import styles from './index.module.css'

export type OverviewPageShellProps = {
  /** Label for the "Global" home breadcrumb (owned by the page so it stays in its namespace). */
  homeLabel: React.ReactNode
  /** The final, current-page breadcrumb. */
  crumb: React.ReactNode
  eyebrow: React.ReactNode
  title: React.ReactNode
  /** Optional line(s) under the title — a count, a data-source note, a filter pill. */
  subtitle?: React.ReactNode
  /** The right-aligned switcher, typically a `<Select>`. */
  switcher: React.ReactNode
  /** Forwarded to the body's `ErrorBoundary`. */
  onReset: () => void
  children: React.ReactNode
}

/**
 * Header + title block + error-bounded body scaffold shared by the filterable overview
 * pages (`/region/[region]`, `/income/[level]`, `/rankings/[indicator]`). Layout only —
 * the page still owns its breadcrumb text, switcher options and section content.
 */
export default function OverviewPageShell({
  homeLabel,
  crumb,
  eyebrow,
  title,
  subtitle,
  switcher,
  onReset,
  children
}: OverviewPageShellProps) {
  return (
    <>
      <AppHeader>
        <Breadcrumbs>
          <Link href={ROUTES.home()}>
            <Typography variant='body-sm' color='muted' component='span'>
              {homeLabel}
            </Typography>
          </Link>
          <Typography variant='body-sm' color='knockout' component='span' aria-current='page'>
            {crumb}
          </Typography>
        </Breadcrumbs>
      </AppHeader>

      <TitleBlock className={styles.titleBlock}>
        <div>
          <Typography variant='meta-sm' color='subtle' component='div'>
            {eyebrow}
          </Typography>
          <Typography variant='headline-sm' component='h1'>
            {title}
          </Typography>
          {subtitle}
        </div>
        <TitleMeta className={styles.rightMeta}>{switcher}</TitleMeta>
      </TitleBlock>

      <ErrorBoundary onReset={onReset}>{children}</ErrorBoundary>
    </>
  )
}
