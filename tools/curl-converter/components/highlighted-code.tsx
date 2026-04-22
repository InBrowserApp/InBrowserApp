import hljs from "highlight.js/lib/core"
import bash from "highlight.js/lib/languages/bash"
import c from "highlight.js/lib/languages/c"
import clojure from "highlight.js/lib/languages/clojure"
import csharp from "highlight.js/lib/languages/csharp"
import dart from "highlight.js/lib/languages/dart"
import elixir from "highlight.js/lib/languages/elixir"
import go from "highlight.js/lib/languages/go"
import http from "highlight.js/lib/languages/http"
import java from "highlight.js/lib/languages/java"
import javascript from "highlight.js/lib/languages/javascript"
import json from "highlight.js/lib/languages/json"
import julia from "highlight.js/lib/languages/julia"
import kotlin from "highlight.js/lib/languages/kotlin"
import lua from "highlight.js/lib/languages/lua"
import matlab from "highlight.js/lib/languages/matlab"
import objectivec from "highlight.js/lib/languages/objectivec"
import ocaml from "highlight.js/lib/languages/ocaml"
import perl from "highlight.js/lib/languages/perl"
import php from "highlight.js/lib/languages/php"
import powershell from "highlight.js/lib/languages/powershell"
import python from "highlight.js/lib/languages/python"
import r from "highlight.js/lib/languages/r"
import ruby from "highlight.js/lib/languages/ruby"
import rust from "highlight.js/lib/languages/rust"
import swift from "highlight.js/lib/languages/swift"
import yaml from "highlight.js/lib/languages/yaml"

import { ScrollArea } from "@workspace/ui/components/ui/scroll-area"
import { cn } from "@workspace/ui/lib/utils"

const registrations = {
  bash,
  c,
  clojure,
  csharp,
  dart,
  elixir,
  go,
  http,
  java,
  javascript,
  json,
  julia,
  kotlin,
  lua,
  matlab,
  objectivec,
  ocaml,
  perl,
  php,
  powershell,
  python,
  r,
  ruby,
  rust,
  swift,
  yaml,
}

for (const [language, definition] of Object.entries(registrations)) {
  if (!hljs.getLanguage(language)) {
    hljs.registerLanguage(language, definition)
  }
}

type HighlightedCodeProps = Readonly<{
  ariaLabel: string
  className?: string
  highlightLanguage: string
  value: string
}>

function HighlightedCode({
  ariaLabel,
  className,
  highlightLanguage,
  value,
}: HighlightedCodeProps) {
  const hasText = value.trim().length > 0
  const canHighlight =
    highlightLanguage !== "plaintext" && hljs.getLanguage(highlightLanguage)

  const highlightedHtml =
    hasText && canHighlight
      ? hljs.highlight(value, { language: highlightLanguage }).value
      : ""

  return (
    <ScrollArea
      role="region"
      aria-label={ariaLabel}
      className={cn("rounded-lg border border-input bg-transparent", className)}
    >
      {canHighlight && hasText ? (
        <pre className="curl-highlight min-h-full px-3 py-2.5">
          <code
            className="hljs bg-transparent p-0"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      ) : (
        <pre className="curl-highlight min-h-full px-3 py-2.5">
          <code className="bg-transparent p-0">{value}</code>
        </pre>
      )}
    </ScrollArea>
  )
}

export { HighlightedCode }
