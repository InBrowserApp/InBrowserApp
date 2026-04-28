"use client"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Card,
  CardContent,
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
import { LayoutGrid } from "@workspace/ui/icons"

import type { DisplayFont, LocalFontBookMessages } from "../types"

type FontDetailsPanelProps = Readonly<{
  messages: LocalFontBookMessages
  activeFont: DisplayFont | null
  cssSnippet: string
}>

function FontDetailsPanel({
  messages,
  activeFont,
  cssSnippet,
}: FontDetailsPanelProps) {
  if (!activeFont) {
    return (
      <Card>
        <CardHeader className="gap-3 border-b">
          <CardTitle>{messages.detailsTitle}</CardTitle>
          <CardDescription>{messages.detailsDescription}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Empty className="min-h-56">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LayoutGrid />
              </EmptyMedia>
              <EmptyTitle>{messages.detailsTitle}</EmptyTitle>
              <EmptyDescription>{messages.previewEmpty}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="gap-3 border-b">
        <CardTitle>{messages.detailsTitle}</CardTitle>
        <CardDescription>{messages.detailsDescription}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-4">
        <dl className="grid gap-2.5">
          <DetailRow label={messages.detailsFamily} value={activeFont.family} />
          <DetailRow
            label={messages.detailsFullName}
            value={activeFont.fullName}
          />
          <DetailRow
            label={messages.detailsPostscript}
            value={activeFont.postscriptName}
            mono
          />
          <DetailRow label={messages.detailsStyle} value={activeFont.style} />
        </dl>

        <section className="rounded-xl border bg-muted/15 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-medium">{messages.cssTitle}</div>
            <ToolCopyButton
              value={cssSnippet}
              copyLabel={messages.copyCssLabel}
              copiedLabel={messages.copiedLabel}
              variant="ghost"
            />
          </div>
          <pre
            data-testid="css-snippet"
            className="mt-3 overflow-x-auto rounded-lg border bg-background px-4 py-3 text-sm leading-6 whitespace-pre-wrap"
          >
            {cssSnippet}
          </pre>
        </section>
      </CardContent>
    </Card>
  )
}

function DetailRow({
  label,
  value,
  mono = false,
}: Readonly<{
  label: string
  value: string
  mono?: boolean
}>) {
  return (
    <div className="grid gap-1.5 rounded-xl border bg-muted/10 px-4 py-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-start sm:gap-3">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono text-sm break-all" : "text-sm"}>
        {value || "--"}
      </dd>
    </div>
  )
}

export default FontDetailsPanel
