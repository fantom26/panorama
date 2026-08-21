import clsx from 'clsx'

import Typography from '../../DataDisplay/Typography'
import styles from './index.module.css'

export type SectionProps = Omit<React.ComponentProps<'section'>, 'title' | 'children'> & {
  number: string
  title: string
  action?: string
  children: React.ReactNode
}

export default function Section({
  number,
  title,
  action,
  children,
  className,
  ...rest
}: SectionProps) {
  return (
    <section className={clsx(styles.section, className)} {...rest}>
      <div className={styles.header}>
        <div>
          <Typography variant='meta-sm' color='subtle' component='div' className={styles.number}>
            {number}
          </Typography>
          <Typography variant='title-sm' component='h2'>
            {title}
          </Typography>
        </div>
        {action && (
          <Typography variant='meta-sm' color='subtle' component='span'>
            {action}
          </Typography>
        )}
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  )
}
