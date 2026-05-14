import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { FileText, LoaderCircle, TriangleAlert } from "@workspace/ui/icons"

import type {
  CertificateParseState,
  CertificatePublicKeyParserMessages,
} from "../client/types"
import { ParsedEntrySection } from "./parsed-entry-section"

type ParserResultsProps = Readonly<{
  messages: CertificatePublicKeyParserMessages
  state: CertificateParseState
}>

function ParserResults({ messages, state }: ParserResultsProps) {
  if (state.status === "idle") {
    return (
      <Empty className="min-h-72 border bg-muted/20">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText />
          </EmptyMedia>
          <EmptyTitle>{messages.resultsEmptyTitle}</EmptyTitle>
          <EmptyDescription>
            {messages.resultsEmptyDescription}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (state.status === "loading") {
    return (
      <Empty className="min-h-72 border bg-muted/20">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LoaderCircle className="animate-spin motion-reduce:animate-none" />
          </EmptyMedia>
          <EmptyTitle>{messages.loadingTitle}</EmptyTitle>
          <EmptyDescription>{messages.loadingDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (state.status === "error") {
    return (
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertTitle>{messages.parseErrorTitle}</AlertTitle>
        <AlertDescription>{state.message}</AlertDescription>
      </Alert>
    )
  }

  const jsonValue = JSON.stringify(state.entries, null, 2)

  return (
    <div className="grid gap-4">
      {state.warnings.length > 0 ? (
        <Alert>
          <TriangleAlert />
          <AlertTitle>{messages.warningsTitle}</AlertTitle>
          <AlertDescription>
            <ul className="list-disc ps-4">
              {state.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-wrap justify-end gap-2">
        <ToolCopyButton
          value={jsonValue}
          copyLabel={messages.copyJsonLabel}
          copiedLabel={messages.copiedLabel}
          variant="ghost"
        />
      </div>

      <div className="grid gap-4">
        {state.entries.map((entry, index) => (
          <ParsedEntrySection
            key={`${entry.type}-${entry.fingerprints.sha256}-${index}`}
            entry={entry}
            messages={messages}
          />
        ))}
      </div>
    </div>
  )
}

export { ParserResults }
