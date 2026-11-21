import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import clsx from 'clsx'

import styles from './index.module.css'

function Input({ className, ...rest }: React.ComponentProps<typeof BaseCombobox.Input>) {
  return <BaseCombobox.Input className={clsx(styles.input, className)} {...rest} />
}

function Positioner({
  className,
  sideOffset = 4,
  ...rest
}: React.ComponentProps<typeof BaseCombobox.Positioner>) {
  return (
    <BaseCombobox.Positioner
      className={clsx(styles.positioner, className)}
      sideOffset={sideOffset}
      {...rest}
    />
  )
}

function Popup({ className, ...rest }: React.ComponentProps<typeof BaseCombobox.Popup>) {
  return <BaseCombobox.Popup className={clsx(styles.popup, className)} {...rest} />
}

function List({ className, ...rest }: React.ComponentProps<typeof BaseCombobox.List>) {
  return <BaseCombobox.List className={clsx(styles.list, className)} {...rest} />
}

function Item({ className, ...rest }: React.ComponentProps<typeof BaseCombobox.Item>) {
  return <BaseCombobox.Item className={clsx(styles.item, className)} {...rest} />
}

function Empty({ className, ...rest }: React.ComponentProps<typeof BaseCombobox.Empty>) {
  return <BaseCombobox.Empty className={clsx(styles.empty, className)} {...rest} />
}

function Status({ className, ...rest }: React.ComponentProps<typeof BaseCombobox.Status>) {
  return <BaseCombobox.Status className={clsx(styles.status, className)} {...rest} />
}

const Combobox = {
  Root: BaseCombobox.Root,
  Portal: BaseCombobox.Portal,
  Positioner,
  Popup,
  Input,
  List,
  Item,
  ItemIndicator: BaseCombobox.ItemIndicator,
  Empty,
  Status,
  Icon: BaseCombobox.Icon,
  Clear: BaseCombobox.Clear,
  Value: BaseCombobox.Value,
  Trigger: BaseCombobox.Trigger
}

export default Combobox
