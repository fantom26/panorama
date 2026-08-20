import { Select as BaseSelect } from '@base-ui/react/select'
import clsx from 'clsx'

import Icon from '@/components/DataDisplay/Icon'
import styles from '@/components/Forms/Select/index.module.css'

export type SelectOption = {
  label: string
  value: string
  disabled?: boolean
}

export type SelectProps = Omit<
  React.ComponentProps<typeof BaseSelect.Root<string>>,
  'items' | 'children'
> & {
  options: SelectOption[]
  placeholder?: string
  error?: boolean
  className?: string
  'aria-label'?: string
}

export default function Select({
  options,
  placeholder,
  error,
  disabled,
  className,
  'aria-label': ariaLabel,
  ...rest
}: SelectProps) {
  return (
    <BaseSelect.Root items={options} disabled={disabled} {...rest}>
      <BaseSelect.Trigger
        className={clsx(styles.trigger, className)}
        data-invalid={error || undefined}
        aria-label={ariaLabel}
      >
        <BaseSelect.Value placeholder={placeholder} className={styles.value} />
        <BaseSelect.Icon className={styles.icon}>
          <Icon name='chevron-down' size={14} />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner className={styles.positioner} sideOffset={4}>
          <BaseSelect.Popup className={styles.popup}>
            <BaseSelect.List>
              {options.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={styles.item}
                >
                  <BaseSelect.ItemText className={styles.itemText}>
                    {option.label}
                  </BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator className={styles.itemIndicator}>
                    <Icon name='check' size={14} />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  )
}
