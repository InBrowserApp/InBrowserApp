import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { LoaderCircle, TriangleAlert } from "@workspace/ui/icons"

import type {
  Blake3DigestState,
  Blake3HashTextOrFilePageMessages,
} from "../client/types"
import { HashOutputGrid } from "./hash-output-grid"

type ResultsCardProps = Readonly<{
  digestState: Blake3DigestState
  messages: Blake3HashTextOrFilePageMessages
  selectedFile: File | null
}>

function ResultsCard({
  digestState,
  messages,
  selectedFile,
}: ResultsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="grid gap-1">
          <CardTitle>{messages.hashResultLabel}</CardTitle>
          <CardDescription>
            {selectedFile
              ? `${selectedFile.name} • ${formatFileSize(selectedFile.size)}`
              : messages.hashResultDescription}
          </CardDescription>
        </div>
        {digestState.status === "loading" ? (
          <CardAction>
            <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {digestState.status === "idle" ? (
          <div className="flex min-h-64 flex-1 items-center justify-center rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
            {messages.plainTextDescription}
          </div>
        ) : null}

        {digestState.status === "error" ? (
          <Alert variant="destructive">
            <TriangleAlert />
            {digestState.reason === "invalidBase64" ? (
              <>
                <AlertTitle>{messages.invalidBase64Title}</AlertTitle>
                <AlertDescription>
                  {messages.invalidBase64Description}
                </AlertDescription>
              </>
            ) : (
              <AlertDescription>{digestState.message}</AlertDescription>
            )}
          </Alert>
        ) : null}

        {digestState.status === "loading" || digestState.status === "ready" ? (
          <HashOutputGrid
            messages={messages}
            digest={digestState.status === "ready" ? digestState.digest : null}
            loading={digestState.status === "loading"}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}

function formatFileSize(bytes: number) {
  if (bytes === 0) {
    return "0 B"
  }

  const units = ["B", "KB", "MB", "GB"] as const
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  )
  const value = bytes / 1024 ** exponent

  return `${value >= 10 || exponent === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`
}

export { ResultsCard }
