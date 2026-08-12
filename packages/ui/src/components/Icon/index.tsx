import type { LucideProps } from 'lucide-react'

import { type IconName, icons } from '@/components/Icon/icons'

export type { IconName }

export type IconProps = LucideProps & {
  name: IconName
}

export default function Icon({ name, size = 16, ...rest }: IconProps) {
  const IconComponent = icons[name]

  return <IconComponent size={size} {...rest} />
}
