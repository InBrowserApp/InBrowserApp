import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { LoaderCircle } from "@workspace/ui/icons"

type MacAddressDataStatusProps = Readonly<{
  loading: boolean
  error: boolean
  onRetry: () => void
  updatedLabel?: string
  labels: Readonly<{
    loading: string
    loadError: string
    retry: string
    source: string
  }>
}>

function MacAddressDataStatus({
  loading,
  error,
  onRetry,
  updatedLabel,
  labels,
}: MacAddressDataStatusProps) {
  if (loading) {
    return (
      <p
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <LoaderCircle
          aria-hidden="true"
          className="size-4 shrink-0 animate-spin motion-reduce:animate-none"
        />
        {labels.loading}
      </p>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="text-start">
        <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
          <span>{labels.loadError}</span>
          <Button type="button" variant="outline" onClick={onRetry}>
            {labels.retry}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <footer className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <a
        href="https://standards.ieee.org/products-programs/regauth/"
        className="rounded-sm underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        {labels.source}
      </a>
      {updatedLabel ? <span>{updatedLabel}</span> : null}
    </footer>
  )
}

export { MacAddressDataStatus }
