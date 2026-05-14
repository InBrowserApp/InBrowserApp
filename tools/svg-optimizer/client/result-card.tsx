import { useState } from "react"

import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
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
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Copy, Download, TriangleAlert } from "@workspace/ui/icons"

import { formatByteSize } from "../core/svg-optimizer"

import type { SvgOptimizationResult, SvgOptimizerMessages } from "./types"

type ResultCardProps = Readonly<{
  downloadUrl: string | null
  messages: SvgOptimizerMessages
  optimizedPreviewUrl: string | null
  result: SvgOptimizationResult | null
  sourcePreviewUrl: string | null
}>

function MetricGrid({
  messages,
  result,
}: Readonly<{
  messages: SvgOptimizerMessages
  result: SvgOptimizationResult
}>) {
  const { metrics } = result
  const savedLabel =
    metrics.savedBytes >= 0
      ? `${formatByteSize(metrics.savedBytes)} (${metrics.savedPercent.toFixed(
          1
        )}%)`
      : `${messages.largerOutputLabel} ${formatByteSize(
          Math.abs(metrics.savedBytes)
        )}`

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-lg border bg-muted/20 p-3">
        <p className="text-sm text-muted-foreground">
          {messages.originalSizeLabel}
        </p>
        <p className="font-mono text-lg">
          {formatByteSize(metrics.originalBytes)}
        </p>
      </div>
      <div className="rounded-lg border bg-muted/20 p-3">
        <p className="text-sm text-muted-foreground">
          {messages.optimizedSizeLabel}
        </p>
        <p className="font-mono text-lg">
          {formatByteSize(metrics.optimizedBytes)}
        </p>
      </div>
      <div className="rounded-lg border bg-muted/20 p-3">
        <p className="text-sm text-muted-foreground">{messages.savedLabel}</p>
        <p className="font-mono text-lg">{savedLabel}</p>
      </div>
    </div>
  )
}

function PreviewPane({
  label,
  previewUrl,
}: Readonly<{
  label: string
  previewUrl: string | null
}>) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{label}</p>
        <Badge variant="outline">SVG</Badge>
      </div>
      <div className="flex min-h-64 items-center justify-center rounded-lg border bg-[linear-gradient(135deg,rgba(161,161,170,0.10),rgba(228,228,231,0.20))] p-4">
        {previewUrl ? (
          <img
            alt={label}
            className="max-h-72 max-w-full object-contain"
            src={previewUrl}
          />
        ) : null}
      </div>
    </div>
  )
}

export function ResultCard({
  downloadUrl,
  messages,
  optimizedPreviewUrl,
  result,
  sourcePreviewUrl,
}: ResultCardProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle"
  )

  async function handleCopy() {
    if (!result) {
      return
    }

    try {
      await navigator.clipboard.writeText(result.optimizedSvg)
      setCopyState("copied")
    } catch {
      setCopyState("failed")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.resultTitle}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {result ? (
          <>
            <MetricGrid messages={messages} result={result} />
            <div className="grid gap-5 lg:grid-cols-2">
              <PreviewPane
                label={messages.originalLabel}
                previewUrl={sourcePreviewUrl}
              />
              <PreviewPane
                label={messages.optimizedLabel}
                previewUrl={optimizedPreviewUrl}
              />
            </div>
            <Field>
              <FieldLabel htmlFor="svg-optimizer-output">
                {messages.outputCodeLabel}
              </FieldLabel>
              <Textarea
                className="min-h-56 font-mono text-sm"
                id="svg-optimizer-output"
                readOnly
                value={result.optimizedSvg}
              />
            </Field>
            {copyState === "failed" ? (
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertDescription>{messages.copyFailedError}</AlertDescription>
              </Alert>
            ) : null}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button onClick={() => void handleCopy()} type="button">
                <Copy data-icon="inline-start" />
                {copyState === "copied"
                  ? messages.copiedLabel
                  : messages.copyLabel}
              </Button>
              {downloadUrl ? (
                <Button asChild variant="outline">
                  <a download={result.fileName} href={downloadUrl}>
                    <Download data-icon="inline-start" />
                    {messages.downloadLabel}
                  </a>
                </Button>
              ) : (
                <Button disabled variant="outline">
                  <Download data-icon="inline-start" />
                  {messages.downloadLabel}
                </Button>
              )}
            </div>
          </>
        ) : (
          <Empty className="border border-dashed border-border/80 bg-muted/20">
            <EmptyHeader>
              <EmptyTitle>{messages.emptyResultTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.emptyResultDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}
