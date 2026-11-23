import type { ReactNode } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/ui/card"
import { LoaderCircle, RotateCcw, TriangleAlert } from "@workspace/ui/icons"

export function Loading({ label, query }: { label: string; query?: string }) {
  if (!query) {
    return (
      <p
        role="status"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <LoaderCircle
          className="size-4 motion-safe:animate-spin"
          aria-hidden="true"
        />
        {label}
      </p>
    )
  }

  return (
    <div>
      <p role="status" className="sr-only">
        {label}
      </p>
      <Card aria-hidden="true" className="min-w-0 motion-safe:animate-pulse">
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-20 rounded-full bg-muted" />
            <div className="h-6 w-24 rounded-full bg-muted" />
          </div>
          <div className="flex gap-2">
            <div className="h-7 w-24 rounded-md bg-muted" />
            <div className="size-7 rounded-md bg-muted" />
          </div>
        </CardHeader>
        <CardContent>
          <p
            className="mb-3 font-mono text-xl font-semibold break-all"
            dir="ltr"
          >
            {query}
          </p>
          <div className="mb-5 grid gap-2.5">
            <div className="h-3 w-3/4 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
          </div>
          {[0, 1].map((row) => (
            <div key={row} className="mb-3 grid gap-2">
              <div className="h-3 w-2/3 rounded bg-muted" />
              <div className="h-11 rounded-md bg-muted" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function LoadError({
  message,
  retry,
  onRetry,
  action,
}: {
  message: string
  retry: string
  onRetry: () => void
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
      <p role="alert" className="flex items-start gap-2 text-sm">
        <TriangleAlert
          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        {message}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          <RotateCcw data-icon="inline-start" aria-hidden="true" />
          {retry}
        </Button>
        {action}
      </div>
    </div>
  )
}
