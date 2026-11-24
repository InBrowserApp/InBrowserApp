import { Button } from "@workspace/ui/components/ui/button"
import { LoaderCircle } from "@workspace/ui/icons"
import type { Controls } from "./types"
import type { useJob } from "./use-job"

type Job = ReturnType<typeof useJob>

export function JobFeedback({
  messages: m,
  lang,
  status,
  notice,
  invalid,
  cancel,
}: {
  messages: Controls
  lang: string
  status: Job["status"]
  notice: Job["notice"]
  invalid: boolean
  cancel: () => void
}) {
  return (
    <>
      {status && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/35 p-3">
          <p
            className="flex min-w-0 flex-1 items-center gap-2 text-sm"
            role="status"
          >
            <LoaderCircle
              className="size-4 shrink-0 motion-safe:animate-spin"
              aria-hidden
            />
            <span>
              {m[status.label]}{" "}
              {status.backend === "webgpu"
                ? "WebGPU"
                : status.backend
                  ? "CPU"
                  : ""}
            </span>
            {status.progress !== undefined && (
              <span className="tabular-nums">
                {new Intl.NumberFormat(lang, { style: "percent" }).format(
                  status.progress
                )}
              </span>
            )}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={cancel}>
            {m.cancel}
          </Button>
        </div>
      )}
      {notice && (
        <p
          role={notice.error ? "alert" : "status"}
          className={
            notice.error
              ? "text-sm text-destructive"
              : "text-sm text-muted-foreground"
          }
        >
          {m[notice.label]}
        </p>
      )}
      {invalid && (
        <p className="text-sm text-destructive" role="alert">
          {m.invalidTiming}
        </p>
      )}
    </>
  )
}
