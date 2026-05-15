import { useMemo } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { ArrowRight, Copy, FileText } from "@workspace/ui/icons"

import { formatBarcodeFormat } from "../core/barcode-decoder"
import { classifyBarcodeContent } from "../core/content-type"

import type {
  BarcodeReaderMessages,
  BarcodeReaderResult,
  ContentTypeLabelMap,
} from "./types"

type ResultCardProps = Readonly<{
  messages: BarcodeReaderMessages
  result: BarcodeReaderResult | null
}>

function createContentTypeLabels(
  messages: BarcodeReaderMessages
): ContentTypeLabelMap {
  return {
    calendar: messages.contentTypeCalendar,
    email: messages.contentTypeEmail,
    location: messages.contentTypeLocation,
    phone: messages.contentTypePhone,
    sms: messages.contentTypeSms,
    text: messages.contentTypeText,
    url: messages.contentTypeUrl,
    vcard: messages.contentTypeVcard,
    wifi: messages.contentTypeWifi,
  }
}

function ResultCard({ messages, result }: ResultCardProps) {
  const contentTypeLabels = useMemo(
    () => createContentTypeLabels(messages),
    [messages]
  )
  const content = useMemo(
    () => (result ? classifyBarcodeContent(result.text) : null),
    [result]
  )

  return (
    <ToolPanelCard aria-live="polite">
      <CardHeader className="border-b">
        <CardTitle>{messages.resultTitle}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {result && content ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {messages.formatLabel}: {formatBarcodeFormat(result.format)}
              </Badge>
              <Badge variant="secondary">
                {messages.contentTypeLabel}: {contentTypeLabels[content.kind]}
              </Badge>
              <Badge variant="outline">
                {result.source === "camera"
                  ? messages.sourceCameraLabel
                  : messages.sourceImageLabel}
              </Badge>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">
                {messages.decodedContentLabel}
              </p>
              <pre className="max-h-80 overflow-auto rounded-lg border bg-muted/30 p-3 font-mono text-sm break-words whitespace-pre-wrap">
                {result.text}
              </pre>
            </div>
          </>
        ) : (
          <Empty className="min-h-[16rem] border border-dashed bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>{messages.emptyResultTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.emptyResultDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ToolPanelCardContent>
      {result && content ? (
        <ToolPanelCardFooter className="flex flex-wrap justify-end gap-3 border-t">
          <ToolCopyButton
            copiedLabel={messages.copiedResultLabel}
            copyLabel={messages.copyResultLabel}
            value={result.text}
          />
          {content.href ? (
            <Button asChild size="sm" variant="outline">
              <a href={content.href} rel="noopener noreferrer" target="_blank">
                <ArrowRight data-icon="inline-start" />
                {messages.openResultLabel}
              </a>
            </Button>
          ) : (
            <Button disabled size="sm" type="button" variant="outline">
              <Copy data-icon="inline-start" />
              {messages.openResultLabel}
            </Button>
          )}
        </ToolPanelCardFooter>
      ) : null}
    </ToolPanelCard>
  )
}

export { ResultCard }
