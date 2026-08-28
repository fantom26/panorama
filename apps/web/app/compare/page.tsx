import { Suspense } from 'react'

import CompareView from '@/features/compare/CompareView'

export default function ComparePage() {
  return (
    <Suspense>
      <CompareView />
    </Suspense>
  )
}
