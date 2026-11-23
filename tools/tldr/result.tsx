import { useMemo } from "react"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/ui/card"

import { platformName, publicLanguage, type Variant } from "./core/lookup"
import { renderPage } from "./core/markdown"
import { sourceLink } from "./core/source"
import type { Messages } from "./client"

export function Result({
  page,
  revision,
  markdown,
  link,
  languages,
  messages,
}: {
  page: Variant
  revision: string
  markdown: string
  link: string
  languages: Intl.DisplayNames
  messages: Messages
}) {
  const lang = publicLanguage(page.locale)
  const sections = useMemo(() => renderPage(markdown), [markdown])

  return (
    <Card className="min-w-0">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-muted-foreground">
          {platformName(page.os, messages.common)} · {languages.of(lang)}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <ToolCopyButton
            value={link}
            copyLabel={messages.copyLink}
            copiedLabel={messages.copied}
          />
          <a
            className="underline underline-offset-4"
            href={sourceLink(revision, page)}
            target="_blank"
            rel="noreferrer"
          >
            {messages.source}
          </a>
        </div>
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
                className="mb-3 flex min-w-0 items-start gap-2 rounded-md border bg-muted/50 p-2"
                dir="ltr"
              >
                <pre className="min-w-0 flex-1 overflow-x-auto px-2 py-1.5 text-sm">
                  <code>{section.command}</code>
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
                className="text-sm leading-6 wrap-break-word [&_a]:underline [&_blockquote]:mb-3 [&_blockquote]:text-muted-foreground [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold"
                dangerouslySetInnerHTML={{ __html: section.html }}
              />
            )
          )}
        </article>
      </CardContent>
    </Card>
  )
}
