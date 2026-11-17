import { Button } from "@workspace/ui/components/ui/button"
import { Download, LoaderCircle, Sparkles } from "@workspace/ui/icons"
import { useObjectUrl } from "./use-watermark"
import type { Messages, Result } from "../types"

function Output({
  messages: m,
  result,
  busy,
  preparing,
  canGenerate,
  onGenerate,
}: Readonly<{
  messages: Messages
  result: Result | null
  busy: boolean
  preparing: boolean
  canGenerate: boolean
  onGenerate: () => void
}>) {
  const url = useObjectUrl(result?.blob ?? null)
  return (
    <div className="space-y-4 rounded-xl border bg-card p-4" aria-live="polite">
      <Button
        className="h-auto min-h-11 w-full py-3 whitespace-normal"
        disabled={!canGenerate}
        type="button"
        onClick={onGenerate}
      >
        {busy || preparing ? (
          <LoaderCircle
            aria-hidden="true"
            className="motion-safe:animate-spin"
          />
        ) : (
          <Sparkles aria-hidden="true" />
        )}
        {busy
          ? m.generatingLabel
          : preparing
            ? m.preparingLabel
            : m.generateLabel}
      </Button>
      {result && url ? (
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">{m.resultReady}</p>
            <p className="mt-1 text-xs break-all text-muted-foreground">
              {result.name}
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="h-auto min-h-10 w-full whitespace-normal"
          >
            <a href={url} download={result.name}>
              <Download aria-hidden="true" />
              {m.downloadLabel}
            </a>
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export { Output }
