import { useMemo } from "react"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/ui/card"
import { Languages, Monitor } from "@workspace/ui/icons"

import { platformName, publicLanguage, type Variant } from "./core/lookup"
import { renderPage } from "./core/markdown"
import { sourceLink } from "./core/source"
import { languageName } from "./language-names"
import type { Messages } from "./messages"
import { SourceButton } from "./source-button"

const highlight = {
  text: undefined,
  value:
    "rounded-sm bg-blue-100/80 font-medium text-blue-900 dark:bg-blue-500/20 dark:text-blue-200",
  options: "font-semibold text-violet-800 dark:text-violet-300",
}

export function Result({
  page,
  revision,
  markdown,
  link,
  names,
  fallback,
  messages,
}: {
  page: Variant
  revision: string
  markdown: string
  link: string
  names: Intl.DisplayNames
  fallback: boolean
  messages: Messages
}) {
  const lang = publicLanguage(page.locale)
  const sections = useMemo(() => renderPage(markdown), [markdown])

  return (
    <Card className="min-w-0">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="h-auto min-h-6 max-w-full whitespace-normal"
          >
            <Monitor data-icon="inline-start" aria-hidden="true" />
            {platformName(page.os, messages.common)}
          </Badge>
          <Badge
            variant="secondary"
            className="h-auto min-h-6 max-w-full whitespace-normal"
          >
            <Languages data-icon="inline-start" aria-hidden="true" />
            {languageName(names, lang)}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ToolCopyButton
            value={link}
            copyLabel={messages.copyLink}
            copiedLabel={messages.copied}
            className="h-auto min-h-7 py-1 whitespace-normal"
          />
          <SourceButton
            href={sourceLink(revision, page)}
            label={messages.source}
          />
        </div>
        {fallback && (
          <p className="basis-full text-xs text-muted-foreground">
            {messages.fallback}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <article
          className="flex min-w-0 flex-col gap-2"
          lang={lang}
          dir={["ar", "fa", "he"].includes(lang) ? "rtl" : "ltr"}
        >
          {sections.map((section, index) =>
            section.type === "example" ? (
              <div
                key={index}
                className="mb-3 flex min-w-0 items-start gap-2 rounded-lg border bg-muted/45 p-2"
                dir="ltr"
              >
                <pre className="min-w-0 flex-1 px-2 py-1.5 text-sm wrap-anywhere whitespace-pre-wrap">
                  <code>
                    {section.parts.map((part, partIndex) => (
                      <span
                        key={partIndex}
                        className={highlight[part.kind]}
                        dir={part.kind === "value" ? "auto" : undefined}
                      >
                        {part.text}
                      </span>
                    ))}
                  </code>
                </pre>
                <ToolCopyButton
                  size="icon-sm"
                  value={section.command}
                  copyLabel={messages.copy}
                  copiedLabel={messages.copied}
                />
              </div>
            ) : (
              <div
                key={index}
                className="text-sm leading-6 wrap-break-word [&_a]:underline [&_blockquote]:mb-3 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-0.5 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold"
                dangerouslySetInnerHTML={{ __html: section.html }}
              />
            )
          )}
        </article>
      </CardContent>
    </Card>
  )
}
