import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
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

  return (
    <ToolPanelCard>
      <ToolPanelCardContent className="gap-6 p-5">
        <Field>
          <FieldContent>
            <FieldLabel>{messages.outputLabel}</FieldLabel>
            <FieldDescription>{countLabel}</FieldDescription>
          </FieldContent>
        </Field>

        <HighlightedXml
          ariaLabel={messages.outputLabel}
          emptyDescription={messages.outputEmptyDescription}
          errorDescription={errorDescription}
          errorTitle={messages.outputErrorTitle}
          state={state}
          value={value}
        />
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="justify-end gap-3 border-t px-5 py-4">
        <ToolCopyButton
          value={value}
          copyLabel={messages.copyXmlLabel}
          copiedLabel={messages.copiedLabel}
          disabled={result.state !== "success"}
        />

        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download="sitemap.xml">
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
