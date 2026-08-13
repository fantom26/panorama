import { Children, type ComponentProps, Fragment } from 'react'

import clsx from 'clsx'

import Typography from '@/components/DataDisplay/Typography'
import styles from '@/components/Disclosure/Breadcrumbs/index.module.css'

export default function Breadcrumbs({ children, className, ...rest }: ComponentProps<'nav'>) {
  const items = Children.toArray(children)

  return (
    <nav aria-label='breadcrumb' className={clsx(styles.root, className)} {...rest}>
      <ol className={styles.list}>
        {items.map((item, index) => (
          <Fragment key={index}>
            <li className={styles.item}>{item}</li>
            {index < items.length - 1 && (
              <li className={styles.separator} aria-hidden='true'>
                <Typography variant='body-sm' color='subtle' component='span'>
                  /
                </Typography>
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
