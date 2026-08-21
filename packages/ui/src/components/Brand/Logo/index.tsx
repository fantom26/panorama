import clsx from 'clsx'

import Typography from '../../DataDisplay/Typography'
import styles from './index.module.css'

const SIZE = 32

export type LogoProps = {
  variant?: 'full' | 'mark'
  className?: string
}

export default function Logo({ variant = 'full', className }: LogoProps) {
  const mark = (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox='0 0 64 64'
      className={variant === 'mark' ? clsx(styles.mark, className) : styles.mark}
      role={variant === 'mark' ? 'img' : undefined}
      aria-label={variant === 'mark' ? 'panorama' : undefined}
      aria-hidden={variant === 'full' || undefined}
    >
      <rect width={64} height={64} className={styles.tile} />
      <rect x={10} y={27} width={44} height={10} className={styles.bars} />
      <rect x={10} y={17} width={18} height={4} className={styles.bars} />
      <rect x={36} y={43} width={18} height={4} className={styles.bars} />
    </svg>
  )

  if (variant === 'mark') {
    return mark
  }

  return (
    <span className={clsx(styles.root, className)}>
      {mark}
      <Typography component='span' variant='title-default' className={styles.wordmark}>
        panorama
      </Typography>
    </span>
  )
}
