import clsx from 'clsx'

import Typography from '../../DataDisplay/Typography'
import styles from './index.module.css'

export type SectionProps = Omit<React.ComponentProps<'section'>, 'title' | 'children'> & {
  title: string
  children: React.ReactNode
}

export default function Section({ title, children, className, ...rest }: SectionProps) {
  return (
    <section className={clsx(styles.section, className)} {...rest}>
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
