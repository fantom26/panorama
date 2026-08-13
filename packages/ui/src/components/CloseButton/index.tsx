import Icon from '@/components/Icon'
import IconButton, { type IconButtonProps } from '@/components/IconButton'

export type CloseButtonProps = Omit<IconButtonProps, 'children'>

export default function CloseButton({
  size = 'sm',
  'aria-label': ariaLabel = 'Close',
  ...rest
}: CloseButtonProps) {
  return (
    <IconButton size={size} aria-label={ariaLabel} {...rest}>
      <Icon name='x' />
    </IconButton>
  )
}
