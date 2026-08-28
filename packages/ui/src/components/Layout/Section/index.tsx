import clsx from 'clsx'

import Typography from '../../DataDisplay/Typography'
import styles from './index.module.css'

export type SectionProps = {
  title: string
  children: React.ReactNode
  className?: string
}

export default function Section({ title, children, className }: SectionProps) {
  return (
    <section className={clsx(styles.section, className)}>
      <div className={styles.header}>
        <Typography variant='meta-sm' color='muted' component='div' className={styles.number} />
        <Typography variant='label-sm' component='h2'>
          {title}
        </Typography>
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  )
}
