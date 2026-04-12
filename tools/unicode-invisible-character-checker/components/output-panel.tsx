import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download } from "@workspace/ui/icons"

type OutputPanelProps = Readonly<{
  title: string
  value: string
  filename: string
  downloadLabel: string
  copyLabel: string
  copiedLabel: string
  downloadUrl: string | null
}>

function OutputPanel({
  title,
  value,
  filename,
  downloadLabel,
  copyLabel,
  copiedLabel,
  downloadUrl,
}: OutputPanelProps) {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium">{title}</p>
        <div className="flex flex-wrap items-center gap-2">
          <ToolCopyButton
            value={value}
            copyLabel={copyLabel}
            copiedLabel={copiedLabel}
          />
          {downloadUrl ? (
            <Button asChild size="sm">
              <a href={downloadUrl} download={filename}>
                <Download data-icon="inline-start" />
                {downloadLabel}
              </a>
            </Button>
          ) : (
            <Button type="button" size="sm" disabled>
              <Download data-icon="inline-start" />
              {downloadLabel}
            </Button>
          )}
        </div>
      </div>
      <Textarea
        value={value}
        readOnly
        rows={7}
        className="min-h-56 resize-y font-mono text-sm"
      />
    </div>
  )
}

export { OutputPanel }
