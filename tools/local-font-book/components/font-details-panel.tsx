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
      <Card className="min-w-0">
        <CardHeader className="gap-3 border-b">
          <CardTitle>{messages.detailsTitle}</CardTitle>
          <CardDescription>{messages.detailsDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty className="min-h-40 sm:min-h-48">
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
    <Card className="min-w-0">
      <CardHeader className="gap-3 border-b">
        <CardTitle>{messages.detailsTitle}</CardTitle>
        <CardDescription>{messages.detailsDescription}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
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

        <section className="min-w-0 rounded-xl border bg-muted/15 p-4">
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
            dir="ltr"
            translate="no"
            data-testid="css-snippet"
            className="mt-3 max-w-full overflow-x-auto rounded-lg border bg-background px-4 py-3 text-left text-sm leading-6 break-words whitespace-pre-wrap"
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
      <dd
        dir={mono ? "ltr" : undefined}
        translate={mono ? "no" : undefined}
        className={
          mono
            ? "min-w-0 text-left font-mono text-sm break-all"
            : "min-w-0 text-sm break-words"
        }
      >
        {value || "--"}
      </dd>
    </div>
  )
}

export default FontDetailsPanel
