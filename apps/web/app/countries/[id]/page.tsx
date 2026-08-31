import CountryPage from '@/features/country'
import ErrorBoundary from '@/shared/ui/ErrorBoundary'

export default function Page() {
  return (
    <ErrorBoundary>
      <CountryPage />
    </ErrorBoundary>
  )
}
