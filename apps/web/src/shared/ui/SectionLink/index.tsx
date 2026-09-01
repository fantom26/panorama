import Link from 'next/link'

import { Typography } from '@repo/ui'

import styles from './index.module.css'

export type SectionLinkProps = { href: string; children: React.ReactNode }

/** Trailing drill-down link for a `Section` body — `Section` itself has no action slot. */
export default function SectionLink({ href, children }: SectionLinkProps) {
  return (
    <div className={styles.root}>
      <Link href={href} className={styles.link}>
        <Typography variant='meta-sm' component='span'>
          {children}
        </Typography>
      </Link>
    </div>
  )
}
