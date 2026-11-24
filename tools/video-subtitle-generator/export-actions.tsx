import { Button } from "@workspace/ui/components/ui/button"
import { Captions, Download } from "@workspace/ui/icons"
import type { Controls, VideoFormat } from "./types"

export const selectClass =
  "h-9 max-w-full min-w-0 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"

export function ExportActions({
  messages: m,
  format,
  onFormat,
  onSrt,
  onVideo,
  disabled,
}: {
  messages: Controls
  format: VideoFormat
  onFormat: (format: VideoFormat) => void
  onSrt: () => void
  onVideo: () => void
  disabled: boolean
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={onSrt}
      >
        <Download aria-hidden />
        {m.downloadSrt}
      </Button>
      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label={m.exportFormat}
          className={selectClass}
          value={format}
          disabled={disabled}
          onChange={(event) =>
            onFormat(event.currentTarget.value === "mkv" ? "mkv" : "mp4")
          }
        >
          <option value="mp4">MP4</option>
          <option value="mkv">MKV</option>
        </select>
        <Button type="button" disabled={disabled} onClick={onVideo}>
          <Captions aria-hidden />
          {m.exportVideo}
        </Button>
      </div>
    </div>
  )
}
