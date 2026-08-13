import {
  ArrowLeft,
  Check,
  ChevronDown,
  CircleAlert,
  Inbox,
  Minus,
  Plus,
  Search,
  X
} from 'lucide-react'

export const icons = {
  'arrow-left': ArrowLeft,
  check: Check,
  'chevron-down': ChevronDown,
  'circle-alert': CircleAlert,
  inbox: Inbox,
  minus: Minus,
  plus: Plus,
  search: Search,
  x: X
}

export type IconName = keyof typeof icons
