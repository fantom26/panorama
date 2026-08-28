import { useState } from 'react'

import clsx from 'clsx'

import type { Alpha2Code } from '../../../types/country.types'
import styles from './index.module.css'

export type FlagProps = {
  code: Alpha2Code
  className?: string
}

export default function Flag({ code, className }: FlagProps) {
  const [failed, setFailed] = useState(false)
  const cc = code.trim().toLowerCase()

  if (!cc || failed) {
    return <span className={clsx(styles.flag, className)} aria-hidden='true' />
  }

  return (
    <img
      className={clsx(styles.flag, className)}
      src={`https://flagcdn.com/w40/${cc}.png`}
      srcSet={`https://flagcdn.com/w80/${cc}.png 2x`}
      width={20}
      height={15}
      alt=''
      loading='lazy'
      decoding='async'
      onError={() => setFailed(true)}
    />
  )
}
