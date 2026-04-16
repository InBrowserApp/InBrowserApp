import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Download, LoaderCircle, TriangleAlert } from "@workspace/ui/icons"

import { ReadOnlyOutput } from "./read-only-output"

import type { EncodingState, OutputCardMessages } from "../types"

type OutputCardProps = Readonly<{
  state: EncodingState
  outputText: string
  downloadUrl: string | null
  downloadFileName: string
  messages: OutputCardMessages
}>

function OutputCard({
  state,
  outputText,
  downloadUrl,
  downloadFileName,
  messages,
}: OutputCardProps) {
  return (
    <Card>
      <CardHeader className="border-b sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="grid gap-1">
          <CardTitle>{messages.encodedOutputLabel}</CardTitle>
          <CardDescription>{messages.encodedOutputDescription}</CardDescription>
        </div>
        {state.status === "loading" ? (
          <CardAction>
            <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {state.status === "error" ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        ) : state.status === "idle" ? (
          <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
            {messages.emptyStateDescription}
          </div>
        ) : state.status === "loading" ? (
          <div className="min-h-72 animate-pulse rounded-lg border bg-muted/20" />
        ) : (
          <ReadOnlyOutput
            ariaLabel={messages.encodedOutputLabel}
            value={outputText}
            className="min-h-72"
          />
        )}
      </CardContent>
      <CardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={outputText}
          copyLabel={messages.copyResultLabel}
          copiedLabel={messages.copiedLabel}
          disabled={state.status !== "ready"}
        />

        {downloadUrl && state.status === "ready" ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download={downloadFileName}>
              <Download data-icon="inline-start" />
              {messages.downloadFileLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadFileLabel}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export { OutputCard }
