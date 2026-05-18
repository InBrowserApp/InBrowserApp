import hljs from "highlight.js/lib/core"
import bash from "highlight.js/lib/languages/bash"
import css from "highlight.js/lib/languages/css"
import go from "highlight.js/lib/languages/go"
import ini from "highlight.js/lib/languages/ini"
import java from "highlight.js/lib/languages/java"
import javascript from "highlight.js/lib/languages/javascript"
import json from "highlight.js/lib/languages/json"
import kotlin from "highlight.js/lib/languages/kotlin"
import markdown from "highlight.js/lib/languages/markdown"
import php from "highlight.js/lib/languages/php"
import plaintext from "highlight.js/lib/languages/plaintext"
import python from "highlight.js/lib/languages/python"
import ruby from "highlight.js/lib/languages/ruby"
import rust from "highlight.js/lib/languages/rust"
import sql from "highlight.js/lib/languages/sql"
import typescript from "highlight.js/lib/languages/typescript"
import xml from "highlight.js/lib/languages/xml"
import yaml from "highlight.js/lib/languages/yaml"

import { ScrollArea } from "@workspace/ui/components/ui/scroll-area"

const languages = {
  bash,
  css,
  go,
  ini,
  java,
  javascript,
  json,
  kotlin,
  markdown,
  php,
  plaintext,
  python,
  ruby,
  rust,
  sql,
  typescript,
  xml,
  yaml,
}

for (const [language, definition] of Object.entries(languages)) {
  if (!hljs.getLanguage(language)) {
    hljs.registerLanguage(language, definition)
  }
}

type HighlightedPreviewProps = Readonly<{
  ariaLabel: string
  language: string
  value: string
}>

function HighlightedPreview({
  ariaLabel,
  language,
  value,
}: HighlightedPreviewProps) {
  const canHighlight = language !== "plaintext" && hljs.getLanguage(language)
  const highlightedHtml = canHighlight
    ? hljs.highlight(value, { language }).value
    : ""

  return (
    <ScrollArea
      role="region"
      aria-label={ariaLabel}
      className="h-[26rem] rounded-lg border border-input bg-background/60"
    >
      {canHighlight ? (
        <pre className="archive-highlight px-3 py-2.5">
          <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
        </pre>
      ) : (
        <pre className="archive-highlight px-3 py-2.5">
          <code>{value}</code>
        </pre>
      )}
    </ScrollArea>
  )
}

export { HighlightedPreview }
