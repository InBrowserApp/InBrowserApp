import { useEffect, useMemo, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  Download,
  FileJson2,
  ImageIcon,
  LoaderCircle,
} from "@workspace/ui/icons"

import { faviconGeneratorCopy } from "./copy"
import { formatFileSize } from "./format-file-size"
import { useBlobObjectUrl } from "./use-blob-object-url"

import type { GeneratedAssetGroup, GeneratedBlobFile } from "./types"

type DownloadFileButtonProps = Readonly<{
  file: GeneratedBlobFile
}>

function DownloadFileButton({ file }: DownloadFileButtonProps) {
  const url = useBlobObjectUrl(file.blob)

  return (
    <Button asChild size="sm" variant="outline">
      <a href={url ?? undefined} download={file.name}>
        <Download data-icon="inline-start" />
        {file.name}
      </a>
    </Button>
  )
}

type AssetDownloadPanelProps = Readonly<{
  buildGroup: () => Promise<GeneratedAssetGroup | null>
  copyLabel: string
  emptyDescription?: string
  emptyTitle?: string
  enabled: boolean
  snippetLabel: string
  sourceKey: string
}>

function AssetDownloadPanel({
  buildGroup,
  copyLabel,
  emptyDescription = faviconGeneratorCopy.separateDownloadEmptyDescription,
  emptyTitle = faviconGeneratorCopy.separateDownloadEmptyTitle,
  enabled,
  snippetLabel,
  sourceKey,
}: AssetDownloadPanelProps) {
  const [group, setGroup] = useState<GeneratedAssetGroup | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    if (!enabled) {
      setGroup(null)
      setError(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    void buildGroup()
      .then((nextGroup) => {
        if (!cancelled) {
          setGroup(nextGroup)
        }
      })
      .catch((generationError: unknown) => {
        if (!cancelled) {
          setGroup(null)
          setError(
            generationError instanceof Error
              ? generationError.message
              : faviconGeneratorCopy.errorDescription
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [buildGroup, enabled, sourceKey])

  const fileSummary = useMemo(
    () =>
      group?.files.map((file) => ({
        name: file.name,
        size: file.blob.size,
      })) ?? [],
    [group]
  )

  if (!enabled) {
    return (
      <Empty className="border border-dashed border-border/80 bg-muted/20">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ImageIcon />
          </EmptyMedia>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptyDescription>{emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid gap-4">
      {loading ? (
        <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" />
          {faviconGeneratorCopy.loadingDownloadsLabel}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {group ? (
        <>
          <div className="flex flex-wrap gap-2">
            {fileSummary.map((file) => (
              <Badge
                key={file.name}
                variant="secondary"
                className="max-w-full gap-1 font-normal"
              >
                <span className="truncate">{file.name}</span>
                <span className="text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {group.files.map((file) => (
              <DownloadFileButton key={file.name} file={file} />
            ))}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-foreground">
                {snippetLabel}
              </span>
              <ToolCopyButton
                value={group.snippetText}
                copyLabel={copyLabel}
                copiedLabel={copyLabel}
              />
            </div>
            <Textarea
              readOnly
              value={group.snippetText}
              className="min-h-40 font-mono text-xs"
            />
          </div>
        </>
      ) : (
        <Empty className="border border-dashed border-border/80 bg-muted/20">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileJson2 />
            </EmptyMedia>
            <EmptyTitle>{emptyTitle}</EmptyTitle>
            <EmptyDescription>{emptyDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  )
}

export { AssetDownloadPanel }
