import Link from 'next/link'

import { Icon, Typography } from '@repo/ui'

import styles from './index.module.css'

export type SectionLinkProps = { href: string; children: React.ReactNode }

/** Trailing drill-down link for a `Section` body — `Section` itself has no action slot.
 *  The arrow points toward the inline-end edge and flips with the writing direction. */
export default function SectionLink({ href, children }: SectionLinkProps) {
  return (
    <div className={styles.root}>
      <Link href={href} className={styles.link}>
        <Typography variant='meta-sm' component='span'>
          {children}
        </Typography>
        <Icon name='arrow-left' size={14} className={styles.arrow} aria-hidden />
      </Link>
    </div>
  )
}
