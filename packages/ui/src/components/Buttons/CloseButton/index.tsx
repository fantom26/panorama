import { useTranslation } from 'react-i18next'

import Icon from '../../DataDisplay/Icon'
import IconButton, { type IconButtonProps } from '../IconButton'

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
