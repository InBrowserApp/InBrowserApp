import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { LoaderCircle } from "@workspace/ui/icons"

type MacAddressDataStatusProps = Readonly<{
  loading: boolean
  error: boolean
  onRetry: () => void
  updatedLabel?: string
  summary?: string
  labels: Readonly<{
    loading: string
    loadError: string
    retry: string
    source: string
    sourceHint: string
  }>
}>

function MacAddressDataStatus({
  loading,
  error,
  onRetry,
  updatedLabel,
  summary,
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
    <footer className="flex flex-col gap-1 text-xs text-muted-foreground">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <a
          href="https://standards.ieee.org/products-programs/regauth/"
          className="rounded-sm underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {labels.source}
        </a>
        {updatedLabel ? <span>{updatedLabel}</span> : null}
        {summary ? <span>{summary}</span> : null}
      </p>
      <p>{labels.sourceHint}</p>
    </footer>
  )
}

export { MacAddressDataStatus }
