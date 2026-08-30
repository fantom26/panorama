import CountryPage from '@/features/country/CountryPage'
import ErrorBoundary from '@/shared/ui/ErrorBoundary'

export default function Page() {
  return (
    <ErrorBoundary>
      <CountryPage />
    </ErrorBoundary>
  )
}
