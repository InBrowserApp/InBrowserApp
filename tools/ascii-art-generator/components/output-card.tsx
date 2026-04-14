import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Download } from "@workspace/ui/icons"

import type { AsciiArtGeneratorMessages } from "../types"

type OutputCardProps = Readonly<{
  downloadFilename: string
  downloadUrl: string | null
  loading: boolean
  messages: AsciiArtGeneratorMessages
  output: string
}>

function OutputCard({
  downloadFilename,
  downloadUrl,
  loading,
  messages,
  output,
}: OutputCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.outputLabel}</CardTitle>
        <CardDescription>{messages.outputPlaceholder}</CardDescription>
      </CardHeader>
      <CardContent>
        <pre
          role="region"
          aria-label={messages.outputLabel}
          className={`min-h-80 w-full overflow-x-auto rounded-lg border border-input bg-transparent p-3 font-mono text-sm leading-tight ${
            output ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {loading ? "..." : output || messages.outputPlaceholder}
        </pre>
      </CardContent>
      <CardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={output}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
          disabled={output.length === 0}
        />
        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download={downloadFilename}>
              <Download data-icon="inline-start" />
              {messages.downloadLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadLabel}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export { OutputCard }
