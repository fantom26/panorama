import {
  ArrowLeft,
  Check,
  ChevronDown,
  CircleAlert,
  Inbox,
  Minus,
  Moon,
  Plus,
  Search,
  Sun,
  X
} from 'lucide-react'

export const icons = {
  'arrow-left': ArrowLeft,
  check: Check,
  'chevron-down': ChevronDown,
  'circle-alert': CircleAlert,
  inbox: Inbox,
  minus: Minus,
  moon: Moon,
  plus: Plus,
  search: Search,
  sun: Sun,
  x: X
}

export type IconName = keyof typeof icons
