import clsx from 'clsx'

import styles from './TitleMeta.module.css'

export type TitleMetaProps = React.ComponentProps<'div'>

export default function TitleMeta({ className, ...rest }: TitleMetaProps) {
  return <div className={clsx(styles.titleMeta, className)} {...rest} />
}
