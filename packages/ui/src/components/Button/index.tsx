import { Button } from '@base-ui/react/button'

import styles from './index.module.css'

export default function ExampleButton({ children }: { children: React.ReactNode }) {
  return <Button className={styles.Button}>{children}</Button>
}
