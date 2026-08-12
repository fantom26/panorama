import { ArrowLeft, Check, ChevronDown, CircleAlert, Inbox, Plus, Search, X } from 'lucide-react'

export const icons = {
  'arrow-left': ArrowLeft,
  check: Check,
  'chevron-down': ChevronDown,
  'circle-alert': CircleAlert,
  inbox: Inbox,
  plus: Plus,
  search: Search,
  x: X
}

export type IconName = keyof typeof icons
