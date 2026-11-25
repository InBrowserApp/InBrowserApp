import { useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu"
import {
  ChevronDown,
  Download,
  FileImage,
  FileText,
  LoaderCircle,
} from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"

const formats = [
  { value: "pdf", label: "PDF", Icon: FileText },
  { value: "png", label: "PNG", Icon: FileImage },
  { value: "svg", label: "SVG", Icon: FileImage },
] as const

type DownloadFile = { blob: Blob; filename: string }

export function ScoreDownloadMenu({
  messages: m,
  onScore,
  source,
}: {
  messages: { download: string; downloadBusy: string; downloadError: string }
  onScore?: (format: (typeof formats)[number]["value"]) => Promise<DownloadFile>
  source?: { label: string; file: () => DownloadFile }
}) {
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)
  const [status, setStatus] = useState<"idle" | "busy" | "error">("idle")
  const busy = status === "busy"

  async function save(makeFile: () => DownloadFile | Promise<DownloadFile>) {
    setStatus("busy")
    try {
      const { blob, filename } = await makeFile()
      downloadBlob(blob, filename)
      setStatus("idle")
    } catch {
      setStatus("error")
    }
  }

  return (
    <>
      <DropdownMenu
        modal={false}
        dir={
          trigger?.closest("[dir]")?.getAttribute("dir") === "rtl"
            ? "rtl"
            : "ltr"
        }
      >
        <DropdownMenuTrigger asChild>
          <Button
            ref={setTrigger}
            type="button"
            variant="outline"
            className="min-h-11 sm:min-h-8"
            aria-busy={busy}
          >
            {busy ? (
              <LoaderCircle
                data-icon="inline-start"
                aria-hidden="true"
                className="motion-safe:animate-spin"
              />
            ) : (
              <Download data-icon="inline-start" aria-hidden="true" />
            )}
            {m.download}
            <ChevronDown data-icon="inline-end" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-max"
          portalContainer={trigger?.closest("dialog") ?? undefined}
        >
          {onScore &&
            formats.map(({ value, label, Icon }) => (
              <DropdownMenuItem
                key={value}
                disabled={busy}
                className="min-h-10 sm:min-h-8"
                onSelect={() => void save(() => onScore(value))}
              >
                <Icon aria-hidden="true" />
                <bdi>{label}</bdi>
              </DropdownMenuItem>
            ))}
          {onScore && source && <DropdownMenuSeparator />}
          {source && (
            <DropdownMenuItem
              disabled={busy}
              className="min-h-10 sm:min-h-8"
              onSelect={() => void save(source.file)}
            >
              <FileText aria-hidden="true" />
              {source.label}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {busy && (
        <p role="status" className="sr-only">
          {m.downloadBusy}
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="basis-full text-sm text-destructive">
          {m.downloadError}
        </p>
      )}
    </>
  )
}
