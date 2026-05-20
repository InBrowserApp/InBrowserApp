"use client"

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
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Download,
  LayoutGrid,
  LoaderCircle,
  RefreshCcw,
} from "@workspace/ui/icons"

import { formatFileSize } from "./constants"
import type { FaviconMessages, GeneratedAsset, GeneratedBundle } from "./types"

type ResultCardProps = Readonly<{
  messages: FaviconMessages
  bundle: GeneratedBundle | null
  isGenerating: boolean
  canGenerate: boolean
  onGenerate: () => void | Promise<void>
  onReset: () => void
}>

function AssetThumbnail({
  asset,
  downloadLabel,
}: Readonly<{ asset: GeneratedAsset; downloadLabel: string }>) {
  const isSvg = asset.platform === "vector"
  const isManifest = asset.platform === "manifest"

  return (
    <a
      href={asset.previewUrl}
      download={asset.filename}
      title={`${downloadLabel} – ${asset.filename}`}
      className="group flex flex-col gap-1 rounded-lg border border-border/70 bg-card p-2 transition-colors hover:border-foreground/30 hover:bg-muted/40"
    >
      <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-md bg-[conic-gradient(at_top_left,_var(--muted)_25%,_transparent_25%,_transparent_75%,_var(--muted)_75%),conic-gradient(at_top_left,_var(--muted)_25%,_transparent_25%,_transparent_75%,_var(--muted)_75%)] bg-[length:14px_14px] bg-[position:0_0,7px_7px]">
        {isManifest ? (
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
            JSON
          </span>
        ) : isSvg ? (
          <img
            src={asset.previewUrl}
            alt={asset.filename}
            className="max-h-20 max-w-20 object-contain"
          />
        ) : (
          <img
            src={asset.previewUrl}
            alt={asset.filename}
            className="max-h-20 max-w-20 object-contain"
          />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="truncate text-xs font-medium text-foreground">
          {asset.filename}
        </span>
        <div className="flex flex-wrap items-center gap-1">
          {asset.size ? (
            <Badge variant="outline" className="font-mono text-[10px]">
              {asset.size}×{asset.size}
            </Badge>
          ) : null}
          <span className="text-[10px] text-muted-foreground">
            {formatFileSize(asset.byteLength)}
          </span>
        </div>
      </div>
    </a>
  )
}

function ResultCard({
  messages,
  bundle,
  isGenerating,
  canGenerate,
  onGenerate,
  onReset,
}: ResultCardProps) {
  const primaryButtonLabel = bundle
    ? messages.regenerateLabel
    : messages.generateLabel

  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>{messages.resultCardTitle}</CardTitle>
            <CardDescription>{messages.resultCardDescription}</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              disabled={isGenerating}
            >
              <RefreshCcw data-icon="inline-start" />
              {messages.resetLabel}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!canGenerate || isGenerating}
              onClick={() => {
                void onGenerate()
              }}
            >
              {isGenerating ? (
                <LoaderCircle
                  data-icon="inline-start"
                  className="animate-spin"
                />
              ) : null}
              {isGenerating ? messages.generatingLabel : primaryButtonLabel}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {bundle ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {messages.generatedAssetsTitle}
                </span>
                <Badge variant="secondary">
                  {messages.generatedAssetsCountLabel.replace(
                    "{count}",
                    String(bundle.assets.length)
                  )}
                </Badge>
              </div>
              <Button asChild>
                <a
                  href={bundle.zip.url}
                  download={bundle.zip.name}
                  className="inline-flex items-center gap-2"
                >
                  <Download data-icon="inline-start" />
                  {messages.downloadZipLabel}
                </a>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {bundle.assets.map((asset) => (
                <AssetThumbnail
                  key={asset.filename}
                  asset={asset}
                  downloadLabel={messages.downloadAssetLabel}
                />
              ))}
            </div>
            <SnippetPanel
              title={messages.htmlSnippetTitle}
              description={messages.htmlSnippetDescription}
              code={bundle.htmlSnippet}
              copyLabel={messages.copyLabel}
              copiedLabel={messages.copiedLabel}
            />
            <SnippetPanel
              title={messages.manifestPreviewTitle}
              description={messages.manifestPreviewDescription}
              code={bundle.manifestJson}
              copyLabel={messages.copyLabel}
              copiedLabel={messages.copiedLabel}
            />
          </>
        ) : (
          <Empty className="border border-dashed border-border/80 bg-muted/30">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LayoutGrid />
              </EmptyMedia>
              <EmptyTitle>{messages.resultEmptyTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.resultEmptyDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}

function SnippetPanel({
  title,
  description,
  code,
  copyLabel,
  copiedLabel,
}: Readonly<{
  title: string
  description: string
  code: string
  copyLabel: string
  copiedLabel: string
}>) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
        <ToolCopyButton
          value={code}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
        />
      </div>
      <pre className="overflow-auto rounded-lg border border-border/70 bg-muted/40 p-3 font-mono text-xs leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export { ResultCard }
