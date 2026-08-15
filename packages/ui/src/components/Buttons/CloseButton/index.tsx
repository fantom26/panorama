import { useTranslation } from 'react-i18next'

import IconButton, { type IconButtonProps } from '@/components/Buttons/IconButton'
import Icon from '@/components/DataDisplay/Icon'

export type CloseButtonProps = Omit<IconButtonProps, 'children'>

export default function CloseButton({
  size = 'sm',
  'aria-label': ariaLabel,
  ...rest
}: CloseButtonProps) {
  const { t } = useTranslation()

  return (
    <IconButton size={size} aria-label={ariaLabel ?? t('buttons.closeButton.ariaLabel')} {...rest}>
      <Icon name='x' />
    </IconButton>
  )
}
