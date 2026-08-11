import { Separator as BaseSeparator } from '@base-ui/react/separator'
import clsx from 'clsx'

import styles from '@/components/Divider/index.module.css'

export type DividerProps = React.ComponentProps<typeof BaseSeparator>

export default function Divider({ className, ...rest }: DividerProps) {
  return <BaseSeparator className={clsx(styles.divider, className)} {...rest} />
}