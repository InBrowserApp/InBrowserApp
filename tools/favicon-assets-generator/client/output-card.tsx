import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
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
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, ImageIcon, LoaderCircle } from "@workspace/ui/icons"

import { faviconGeneratorCopy } from "./copy"
import { formatFileSize } from "./format-file-size"

import type { GeneratedFaviconBundle } from "./types"

type OutputCardProps = Readonly<{
  bundle: GeneratedFaviconBundle | null
  downloadUrl: string | null
  hasSourceFile: boolean
  isGenerating: boolean
  onGenerate: () => void
}>

function OutputCard({
  bundle,
  downloadUrl,
  hasSourceFile,
  isGenerating,
  onGenerate,
}: OutputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{faviconGeneratorCopy.outputTitle}</CardTitle>
        <CardDescription>
          {faviconGeneratorCopy.outputDescription}
        </CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        {bundle ? (
          <>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">
                {faviconGeneratorCopy.filesLabel}
              </span>
              <div className="flex flex-wrap gap-2">
                {bundle.files.map((file) => (
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
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <span className="text-sm font-medium text-foreground">
                  {faviconGeneratorCopy.headMarkupLabel}
                </span>
                <Textarea
                  readOnly
                  value={bundle.headMarkup}
                  className="min-h-40 font-mono text-xs"
                />
              </div>

              <div className="grid gap-2">
                <span className="text-sm font-medium text-foreground">
                  {faviconGeneratorCopy.manifestLabel}
                </span>
                <Textarea
                  readOnly
                  value={bundle.manifestText}
                  className="min-h-64 font-mono text-xs"
                />
              </div>
            </div>
          </>
        ) : (
          <Empty className="border border-dashed border-border/80 bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon />
              </EmptyMedia>
              <EmptyTitle>{faviconGeneratorCopy.outputEmptyTitle}</EmptyTitle>
              <EmptyDescription>
                {faviconGeneratorCopy.outputEmptyDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex-wrap justify-end gap-3 border-t">
        <ToolCopyButton
          value={bundle?.headMarkup ?? ""}
          copyLabel={faviconGeneratorCopy.copyHeadLabel}
          copiedLabel={faviconGeneratorCopy.copiedHeadLabel}
          disabled={!bundle}
        />
        <ToolCopyButton
          value={bundle?.manifestText ?? ""}
          copyLabel={faviconGeneratorCopy.copyManifestLabel}
          copiedLabel={faviconGeneratorCopy.copiedManifestLabel}
          disabled={!bundle}
        />
        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download="favicon-assets.zip">
              <Download data-icon="inline-start" />
              {faviconGeneratorCopy.downloadZipLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" />
            {faviconGeneratorCopy.downloadZipLabel}
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          disabled={!hasSourceFile || isGenerating}
          onClick={() => {
            onGenerate()
          }}
        >
          {isGenerating ? (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          ) : null}
          {isGenerating
            ? faviconGeneratorCopy.generatingLabel
            : faviconGeneratorCopy.generateLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { OutputCard }
