import { Suspense } from 'react'

import RegionPage from '@/features/region'

export default function Page() {
  return (
    <Suspense>
      <RegionPage />
    </Suspense>
  )
}
