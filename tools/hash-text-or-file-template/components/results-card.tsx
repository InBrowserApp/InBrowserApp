import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Empty, EmptyDescription } from "@workspace/ui/components/ui/empty"
import { LoaderCircle, TriangleAlert } from "@workspace/ui/icons"

import { formatFileSize } from "../client/format"
import type {
  HashDigestState,
  HashTextOrFileTemplatePageMessages,
} from "../client/types"
import type { HashAlgorithm } from "../core/hash"
import { HashOutputGrid } from "./hash-output-grid"

type ResultsCardProps = Readonly<{
  algorithm: HashAlgorithm
  digestState: HashDigestState
  messages: HashTextOrFileTemplatePageMessages
  selectedFile: File | null
}>

function ResultsCard({
  algorithm,
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
              ? `${selectedFile.name} - ${formatFileSize(selectedFile.size)}`
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
          <Empty className="min-h-64 border bg-muted/20">
            <EmptyDescription>{messages.emptyResultLabel}</EmptyDescription>
          </Empty>
        ) : null}

        {digestState.status === "error" ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>{digestState.message}</AlertDescription>
          </Alert>
        ) : null}

        {digestState.status === "loading" || digestState.status === "ready" ? (
          <HashOutputGrid
            messages={messages}
            digest={digestState.status === "ready" ? digestState.digest : null}
            loading={digestState.status === "loading"}
          />
        ) : null}

        <p className="mt-4 text-xs text-muted-foreground">
          {messages.algorithmLabels[algorithm]}
        </p>
      </CardContent>
    </Card>
  )
}

export { ResultsCard }
