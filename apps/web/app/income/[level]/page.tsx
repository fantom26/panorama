import { Suspense } from 'react'

import IncomeLevelPage from '@/features/income'

export default function Page() {
  return (
    <Suspense>
      <IncomeLevelPage />
    </Suspense>
  )
}
