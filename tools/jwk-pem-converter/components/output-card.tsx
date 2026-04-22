import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download } from "@workspace/ui/icons"

type OutputCardProps = Readonly<{
  copiedLabel: string
  copyLabel: string
  downloadLabel: string
  downloadName: string
  downloadUrl: string | null
  title: string
  value: string
}>

function OutputCard({
  copiedLabel,
  copyLabel,
  downloadLabel,
  downloadName,
  downloadUrl,
  title,
  value,
}: OutputCardProps) {
  if (value === "") {
    return null
  }

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <ToolPanelCardContent>
        <Textarea
          aria-label={title}
          readOnly
          value={value}
          className="[field-sizing:fixed] min-h-72 resize-y font-mono text-sm"
        />
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap justify-end gap-3 border-t">
        <ToolCopyButton
          value={value}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
        />
        <Button
          type="button"
          size="sm"
          disabled={downloadUrl === null}
          asChild={downloadUrl !== null}
        >
          {downloadUrl ? (
            <a href={downloadUrl} download={downloadName}>
              <Download data-icon="inline-start" />
              {downloadLabel}
            </a>
          ) : (
            <span>
              <Download data-icon="inline-start" />
              {downloadLabel}
            </span>
          )}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { OutputCard }
