import { ArrowLeft, CircleAlert, Inbox, Plus, X } from 'lucide-react'

export const icons = {
  'arrow-left': ArrowLeft,
  'circle-alert': CircleAlert,
  inbox: Inbox,
  plus: Plus,
  x: X
}

export type IconName = keyof typeof icons
