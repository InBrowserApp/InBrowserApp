import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, TriangleAlert } from "@workspace/ui/icons"

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
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.jsonTitle}</CardTitle>
        <CardDescription>{messages.jsonSubtitle}</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <Textarea
          aria-label={messages.jsonTitle}
          readOnly
          rows={8}
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
          rows={6}
          value={jsonInput}
        />

        <Button onClick={onLoadJson} type="button" variant="outline">
          {messages.loadJson}
        </Button>

        {showError ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>{messages.invalidJson}</AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { JsonCard }
