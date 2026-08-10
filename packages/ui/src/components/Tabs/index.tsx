import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import clsx from 'clsx'

import styles from './index.module.css'

function Root({ className, ...rest }: React.ComponentProps<typeof BaseTabs.Root>) {
  return <BaseTabs.Root className={clsx(styles.Root, className)} {...rest} />
}

function List({ className, ...rest }: React.ComponentProps<typeof BaseTabs.List>) {
  return <BaseTabs.List className={clsx(styles.List, className)} {...rest} />
}

function Tab({ className, ...rest }: React.ComponentProps<typeof BaseTabs.Tab>) {
  return <BaseTabs.Tab className={clsx(styles.Tab, className)} {...rest} />
}

function Panel({ className, ...rest }: React.ComponentProps<typeof BaseTabs.Panel>) {
  return <BaseTabs.Panel className={clsx(styles.Panel, className)} {...rest} />
}

const Tabs = { Root, List, Tab, Panel }

export default Tabs
