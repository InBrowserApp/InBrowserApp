import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Download } from "@workspace/ui/icons"

import type {
  OpenApiToTypescriptConverterMessages,
  OpenApiToTypescriptOutputState,
} from "../client/types"
import { HighlightedTypescript } from "./highlighted-typescript"

type TypescriptOutputCardProps = Readonly<{
  downloadUrl: string | null
  messages: OpenApiToTypescriptConverterMessages
  outputState: OpenApiToTypescriptOutputState
}>

function TypescriptOutputCard({
  downloadUrl,
  messages,
  outputState,
}: TypescriptOutputCardProps) {
  const displayState =
    outputState.state === "generated"
      ? "success"
      : outputState.state === "empty"
        ? "empty"
        : "error"

  const errorTitle =
    outputState.state === "parse-error"
      ? messages.invalidOpenApiLabel
      : outputState.state === "external-refs"
        ? messages.externalRefsLabel
        : messages.generationErrorLabel
  const errorDescription =
    outputState.state === "parse-error" ||
    outputState.state === "generate-error"
      ? outputState.description
      : outputState.state === "external-refs"
        ? messages.externalRefsDescription
        : undefined
  const errorDetails =
    outputState.state === "external-refs" ? (
      <ul className="ml-4 flex list-disc flex-col gap-1 text-sm text-muted-foreground">
        {outputState.refs.map((refValue) => (
          <li key={refValue} className="font-mono">
            {refValue}
          </li>
        ))}
      </ul>
    ) : undefined
  const outputValue =
    outputState.state === "generated" ? outputState.output : ""

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.typescriptLabel}</CardTitle>
        <CardDescription>{messages.typescriptDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <HighlightedTypescript
          ariaLabel={messages.typescriptLabel}
          emptyDescription={messages.typescriptEmptyDescription}
          errorDescription={errorDescription}
          errorDetails={errorDetails}
          errorTitle={errorTitle}
          state={displayState}
          value={outputValue}
        />
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={outputValue}
          copyLabel={messages.copyTypesLabel}
          copiedLabel={messages.copiedLabel}
          disabled={outputState.state !== "generated"}
        />

        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download="openapi-types.d.ts">
              <Download data-icon="inline-start" />
              {messages.downloadTypesLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadTypesLabel}
          </Button>
        )}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { TypescriptOutputCard }
