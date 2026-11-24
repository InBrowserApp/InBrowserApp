import { useId, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { ChevronDown, FileJson2, ImageIcon } from "@workspace/ui/icons"

import type { TokenUri } from "./core/ethereum"
import type { MetadataProblem, TokenMetadata } from "./core/metadata"
import type EnglishMessages from "./messages/en.json"

type Labels = typeof EnglishMessages

export type Result = {
  reference: TokenUri
  metadata?: TokenMetadata
  problem?: MetadataProblem
  json?: string
}

function Preview({
  source,
  label,
  failedLabel,
}: {
  source: string
  label: string
  failedLabel: string
}) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="grid aspect-square max-h-96 min-w-0 place-items-center overflow-hidden rounded-xl bg-muted/50">
      {failed ? (
        <p className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
          <ImageIcon className="size-4 shrink-0" aria-hidden="true" />
          {failedLabel}
        </p>
      ) : (
        <img
          src={source}
          alt={label}
          decoding="async"
          referrerPolicy="no-referrer"
          className="size-full object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

function CopyField({
  label,
  value,
  messages,
}: {
  label: string
  value: string
  messages: Labels
}) {
  return (
    <div className="grid min-w-0 gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-medium">{label}</div>
        <ToolCopyButton
          value={value}
          copyLabel={messages.copy}
          copiedLabel={messages.copied}
          ariaLabel={`${messages.copy} · ${label}`}
        />
      </div>
      <code
        dir="ltr"
        className="max-h-28 overflow-auto rounded-lg bg-muted p-2.5 text-sm wrap-anywhere"
      >
        {value}
      </code>
    </div>
  )
}

export default function ViewerResult({
  result,
  messages,
}: {
  result: Result
  messages: Labels
}) {
  const heading = useId()
  const { reference, metadata, problem } = result
  const json = metadata?.json ?? result.json
  return (
    <ToolPanelCard role="region" aria-labelledby={heading}>
      <CardHeader className="flex flex-wrap items-center justify-between gap-2">
        <CardTitle id={heading} role="heading" aria-level={2}>
          {messages.result}
        </CardTitle>
        <span
          dir="ltr"
          className="rounded-md bg-muted px-2 py-1 text-xs font-medium"
        >
          {reference.standard}
        </span>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {metadata && (
          <div
            className={
              metadata.image
                ? "grid min-w-0 gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
                : "grid min-w-0 gap-4"
            }
          >
            {metadata.image && (
              <Preview
                key={metadata.image}
                source={metadata.image}
                label={metadata.name || messages.preview}
                failedLabel={messages.imageFailed}
              />
            )}
            <div className="grid min-w-0 content-start gap-3">
              {metadata.name && (
                <h3 dir="auto" className="text-lg font-medium wrap-anywhere">
                  {metadata.name}
                </h3>
              )}
              {metadata.description && (
                <p
                  dir="auto"
                  className="text-sm wrap-anywhere whitespace-pre-wrap text-muted-foreground"
                >
                  {metadata.description}
                </p>
              )}
              {metadata.traits.length > 0 && (
                <div className="grid gap-2">
                  <h4 className="text-sm font-medium">{messages.traits}</h4>
                  <dl className="grid grid-cols-2 gap-2 xl:grid-cols-3">
                    {metadata.traits.map(({ label, value }, index) => (
                      <div
                        key={index}
                        className="grid min-w-0 content-start gap-1 rounded-lg border p-2.5"
                      >
                        {label && (
                          <dt
                            dir="auto"
                            className="text-xs wrap-anywhere text-muted-foreground"
                          >
                            {label}
                          </dt>
                        )}
                        <dd dir="auto" className="text-sm wrap-anywhere">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        )}
        <CopyField
          label={messages.tokenUri}
          value={reference.uri}
          messages={messages}
        />
        {reference.resolvedUri !== reference.uri && (
          <CopyField
            label={messages.resolvedUri}
            value={reference.resolvedUri}
            messages={messages}
          />
        )}
        {problem && (
          <p role="alert" className="text-sm text-muted-foreground">
            {messages[problem]}
          </p>
        )}
        {json !== undefined && (
          <details className="group min-w-0 overflow-hidden rounded-lg border">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-3 text-sm font-medium hover:bg-muted/40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2">
                <FileJson2 className="size-4 shrink-0" aria-hidden="true" />
                {messages.rawJson}
              </span>
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="grid gap-2 border-t bg-muted/20 p-3">
              <div className="justify-self-end">
                <ToolCopyButton
                  value={json}
                  copyLabel={messages.copy}
                  copiedLabel={messages.copied}
                  ariaLabel={`${messages.copy} · ${messages.rawJson}`}
                />
              </div>
              <pre
                dir="ltr"
                className="max-h-96 overflow-auto rounded-md bg-muted p-2.5 text-xs wrap-anywhere whitespace-pre-wrap"
              >
                <code>{json}</code>
              </pre>
            </div>
          </details>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
