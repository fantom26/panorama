import { Children, Fragment } from 'react'

import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import Typography from '../../DataDisplay/Typography'
import styles from './index.module.css'

export default function Breadcrumbs({
  children,
  className,
  'aria-label': ariaLabel,
  ...rest
}: React.ComponentProps<'nav'>) {
  const { t } = useTranslation()
  const items = Children.toArray(children)

  return (
    <nav
      aria-label={ariaLabel ?? t('breadcrumbs.ariaLabel')}
      className={clsx(styles.root, className)}
      {...rest}
    >
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
