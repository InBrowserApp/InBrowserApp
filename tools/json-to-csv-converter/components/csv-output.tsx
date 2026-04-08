import { TriangleAlert } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

type CsvOutputProps = Readonly<{
  ariaLabel: string
  emptyDescription: string
  errorDescription: string
  errorTitle: string
  state: "empty" | "error" | "success"
  value: string
}>

function CsvOutput({
  ariaLabel,
  emptyDescription,
  errorDescription,
  errorTitle,
  state,
  value,
}: CsvOutputProps) {
  if (state === "empty") {
    return (
      <div
        role="region"
        aria-label={ariaLabel}
        className="flex min-h-80 w-full flex-1 items-center rounded-lg border border-input bg-transparent px-2.5 py-2"
      >
        <p className="text-sm leading-6 text-muted-foreground">
          {emptyDescription}
        </p>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div
        role="region"
        aria-label={ariaLabel}
        className={cn(
          "flex min-h-80 w-full flex-1 items-start rounded-lg border bg-transparent px-2.5 py-2",
          "border-destructive/50"
        )}
      >
        <div role="alert" className="flex min-h-80 items-start gap-3">
          <TriangleAlert className="mt-0.5 shrink-0 text-destructive" />
          <div className="flex flex-col gap-1">
            <p className="font-heading text-sm font-medium text-destructive">
              {errorTitle}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {errorDescription}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className="min-h-80 w-full rounded-lg border border-input bg-transparent px-2.5 py-2"
    >
      <pre className="overflow-x-auto font-mono text-sm leading-6 break-all whitespace-pre-wrap text-foreground">
        {value}
      </pre>
    </div>
  )
}

export { CsvOutput }
