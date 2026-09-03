import {
  ArrowLeft,
  Check,
  ChevronDown,
  CircleAlert,
  GitCompareArrows,
  Inbox,
  Minus,
  Monitor,
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
  'git-compare': GitCompareArrows,
  inbox: Inbox,
  minus: Minus,
  monitor: Monitor,
  moon: Moon,
  plus: Plus,
  search: Search,
  sun: Sun,
  x: X
}

export type IconName = keyof typeof icons
