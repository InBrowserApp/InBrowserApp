import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, FileJson2, TriangleAlert } from "@workspace/ui/icons"

import type { CssGradientGeneratorMessages } from "../types"

type JsonCardProps = Readonly<{
  jsonDownloadUrl: string | null
  jsonInput: string
  messages: CssGradientGeneratorMessages
  onJsonInputChange: (value: string) => void
  onLoadJson: () => void
  serializedConfig: string
  showError: boolean
}>

function JsonCard({
  jsonDownloadUrl,
  jsonInput,
  messages,
  onJsonInputChange,
  onLoadJson,
  serializedConfig,
  showError,
}: JsonCardProps) {
  return (
    <details className="group rounded-xl border bg-card text-sm text-card-foreground">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <div className="grid gap-1">
          <div className="font-heading text-base leading-snug font-medium">
            {messages.jsonTitle}
          </div>
          <div className="text-muted-foreground">{messages.jsonSubtitle}</div>
        </div>
        <FileJson2 className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-6" />
      </summary>

      <div className="grid gap-4 border-t px-4 py-4">
        <Textarea
          aria-label={messages.jsonTitle}
          readOnly
          rows={4}
          value={serializedConfig}
        />

        <div className="flex flex-wrap gap-2">
          <ToolCopyButton
            copiedLabel={messages.copiedLabel}
            copyLabel={messages.copyJson}
            value={serializedConfig}
          />
          {jsonDownloadUrl ? (
            <Button asChild size="sm" variant="outline">
              <a download="css-gradient.json" href={jsonDownloadUrl}>
                <Download data-icon="inline-start" />
                {messages.downloadJson}
              </a>
            </Button>
          ) : null}
        </div>

        <Textarea
          aria-label={messages.jsonPlaceholder}
          onChange={(event) => {
            onJsonInputChange(event.target.value)
          }}
          placeholder={messages.jsonPlaceholder}
          rows={4}
          value={jsonInput}
        />

        <div className="flex flex-wrap gap-2">
          <Button onClick={onLoadJson} type="button" variant="outline">
            <FileJson2 data-icon="inline-start" />
            {messages.loadJson}
          </Button>
        </div>

        {showError ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>{messages.invalidJson}</AlertDescription>
          </Alert>
        ) : null}
      </div>
    </details>
  )
}

export { JsonCard }
