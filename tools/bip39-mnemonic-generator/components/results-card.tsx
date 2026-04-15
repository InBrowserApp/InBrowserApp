import type { ReactNode } from "react"

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
import { Input } from "@workspace/ui/components/ui/input"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, RefreshCcw, TriangleAlert } from "@workspace/ui/icons"

import type { Bip39ResultsCardProps } from "../types"

function ResultBlock({
  children,
  copyValue,
  label,
  messages,
}: Readonly<{
  children: ReactNode
  copyValue: string
  label: string
  messages: Bip39ResultsCardProps["messages"]
}>) {
  return (
    <div className="grid gap-3 rounded-xl border border-border/80 bg-muted/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium">{label}</div>
        <ToolCopyButton
          value={copyValue}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
          variant="ghost"
          disabled={copyValue.length === 0}
        />
      </div>
      {children}
    </div>
  )
}

function ResultsCard({
  activeTab,
  downloadUrl,
  generatedEntropy,
  generatedMnemonic,
  messages,
  strengthBits,
  validationEntropy,
  validationState,
  validationWordCount,
  wordCount,
  entropyHasError,
  entropyMnemonic,
  mnemonicEntropy,
  mnemonicHasError,
  onRegenerate,
}: Bip39ResultsCardProps) {
  const showGenerateActions =
    activeTab === "generate" && generatedMnemonic.length > 0

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultsTitle}</CardTitle>
        <CardDescription>{messages.resultsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        {activeTab === "generate" ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {messages.validationWordCountLabel.replace(
                  "{count}",
                  String(wordCount)
                )}
              </Badge>
              <Badge variant="outline">
                {messages.entropyBitsLabel.replace(
                  "{bits}",
                  String(strengthBits)
                )}
              </Badge>
            </div>

            <ResultBlock
              copyValue={generatedMnemonic}
              label={messages.generatedMnemonicLabel}
              messages={messages}
            >
              <Textarea
                aria-label={messages.generatedMnemonicLabel}
                value={generatedMnemonic}
                readOnly
                rows={6}
                placeholder={messages.generatedPlaceholder}
                className="min-h-40 resize-y font-mono text-sm"
              />
            </ResultBlock>

            <ResultBlock
              copyValue={generatedEntropy}
              label={messages.generatedEntropyLabel}
              messages={messages}
            >
              <Input
                aria-label={messages.generatedEntropyLabel}
                value={generatedEntropy}
                readOnly
                className="font-mono text-sm"
              />
            </ResultBlock>
          </>
        ) : null}

        {activeTab === "validate" ? (
          validationState === "empty" ? (
            <p className="text-sm text-muted-foreground">
              {messages.validationEmptyLabel}
            </p>
          ) : (
            <div className="grid gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={
                    validationState === "valid" ? "secondary" : "destructive"
                  }
                >
                  {validationState === "valid"
                    ? messages.validationValidLabel
                    : messages.validationInvalidLabel}
                </Badge>
                <Badge variant="outline">
                  {messages.validationWordCountLabel.replace(
                    "{count}",
                    String(validationWordCount)
                  )}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                {validationState === "valid"
                  ? messages.validationValidMessage
                  : messages.validationInvalidMessage}
              </p>

              {validationState === "valid" ? (
                <ResultBlock
                  copyValue={validationEntropy}
                  label={messages.validationEntropyLabel}
                  messages={messages}
                >
                  <Input
                    aria-label={messages.validationEntropyLabel}
                    value={validationEntropy}
                    readOnly
                    className="font-mono text-sm"
                  />
                </ResultBlock>
              ) : null}
            </div>
          )
        ) : null}

        {activeTab === "convert" ? (
          <div className="grid gap-4">
            <ResultBlock
              copyValue={entropyMnemonic}
              label={messages.entropyToMnemonicLabel}
              messages={messages}
            >
              {entropyHasError ? (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  <TriangleAlert className="mt-0.5 shrink-0" />
                  <p>{messages.entropyInvalidMessage}</p>
                </div>
              ) : (
                <Textarea
                  aria-label={messages.entropyToMnemonicLabel}
                  value={entropyMnemonic}
                  readOnly
                  rows={5}
                  placeholder={messages.entropyToMnemonicPlaceholder}
                  className="min-h-32 resize-y font-mono text-sm"
                />
              )}
            </ResultBlock>

            <ResultBlock
              copyValue={mnemonicEntropy}
              label={messages.mnemonicToEntropyLabel}
              messages={messages}
            >
              {mnemonicHasError ? (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  <TriangleAlert className="mt-0.5 shrink-0" />
                  <p>{messages.mnemonicInvalidMessage}</p>
                </div>
              ) : (
                <Input
                  aria-label={messages.mnemonicToEntropyLabel}
                  value={mnemonicEntropy}
                  readOnly
                  placeholder={messages.mnemonicToEntropyPlaceholder}
                  className="font-mono text-sm"
                />
              )}
            </ResultBlock>
          </div>
        ) : null}
      </ToolPanelCardContent>
      {showGenerateActions ? (
        <ToolPanelCardFooter className="justify-between gap-3 border-t">
          <div className="flex flex-wrap items-center gap-2">
            {downloadUrl ? (
              <Button asChild type="button" variant="ghost" size="sm">
                <a href={downloadUrl} download="bip39-mnemonic.txt">
                  <Download data-icon="inline-start" />
                  {messages.downloadLabel}
                </a>
              </Button>
            ) : (
              <Button type="button" variant="ghost" size="sm" disabled>
                <Download data-icon="inline-start" />
                {messages.downloadLabel}
              </Button>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
          >
            <RefreshCcw data-icon="inline-start" />
            {messages.regenerateLabel}
          </Button>
        </ToolPanelCardFooter>
      ) : null}
    </ToolPanelCard>
  )
}

export { ResultsCard }
