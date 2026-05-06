import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Button } from "@workspace/ui/components/ui/button"
import { Download } from "@workspace/ui/icons"

import type { SitemapMode } from "../core/sitemap-state"
import type { BuildSitemapResult } from "../core/sitemap-xml"
import type { SitemapXmlGeneratorMessages } from "../client/types"
import { HighlightedXml } from "./highlighted-xml"

type OutputCardProps = Readonly<{
  messages: SitemapXmlGeneratorMessages
  mode: SitemapMode
  result: BuildSitemapResult
  downloadUrl: string | null
  errorDescription: string
}>

function OutputCard({
  messages,
  mode,
  result,
  downloadUrl,
  errorDescription,
}: OutputCardProps) {
  const state =
    result.state === "success"
      ? "success"
      : result.state === "error"
        ? "error"
        : "empty"

  const countLabel =
    result.state !== "success"
      ? messages.outputDescription
      : mode === "urlset"
        ? messages.generatedUrlCountLabel.replace(
            "{count}",
            String(result.entryCount)
          )
        : messages.generatedSitemapCountLabel.replace(
            "{count}",
            String(result.entryCount)
          )

  const value = result.state === "success" ? result.xml : ""
  const downloadFilename =
    mode === "sitemapindex" ? "sitemap-index.xml" : "sitemap.xml"

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.outputLabel}</CardTitle>
        <CardDescription>{countLabel}</CardDescription>
      </CardHeader>

      <ToolPanelCardContent className="gap-4">
        <HighlightedXml
          ariaLabel={messages.outputLabel}
          emptyDescription={messages.outputEmptyDescription}
          errorDescription={errorDescription}
          errorTitle={messages.outputErrorTitle}
          state={state}
          value={value}
        />
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="flex-wrap justify-start gap-3 border-t sm:justify-end">
        <ToolCopyButton
          value={value}
          copyLabel={messages.copyXmlLabel}
          copiedLabel={messages.copiedLabel}
          disabled={result.state !== "success"}
        />

        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download={downloadFilename}>
              <Download data-icon="inline-start" />
              {messages.downloadXmlLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadXmlLabel}
          </Button>
        )}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { OutputCard }
