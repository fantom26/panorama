import clsx from 'clsx'

import styles from './TitleBlock.module.css'

export type TitleBlockProps = React.ComponentProps<'div'>

export default function TitleBlock({ className, ...rest }: TitleBlockProps) {
  return <div className={clsx(styles.titleBlock, className)} {...rest} />
}
