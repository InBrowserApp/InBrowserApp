import hljs from "highlight.js/lib/core"
import css from "highlight.js/lib/languages/css"
import graphql from "highlight.js/lib/languages/graphql"
import handlebars from "highlight.js/lib/languages/handlebars"
import javascript from "highlight.js/lib/languages/javascript"
import json from "highlight.js/lib/languages/json"
import less from "highlight.js/lib/languages/less"
import markdown from "highlight.js/lib/languages/markdown"
import scss from "highlight.js/lib/languages/scss"
import typescript from "highlight.js/lib/languages/typescript"
import xml from "highlight.js/lib/languages/xml"
import yaml from "highlight.js/lib/languages/yaml"

import { ScrollArea } from "@workspace/ui/components/ui/scroll-area"
import { cn } from "@workspace/ui/lib/utils"

hljs.registerLanguage("css", css)
hljs.registerLanguage("graphql", graphql)
hljs.registerLanguage("handlebars", handlebars)
hljs.registerLanguage("javascript", javascript)
hljs.registerLanguage("json", json)
hljs.registerLanguage("less", less)
hljs.registerLanguage("markdown", markdown)
hljs.registerLanguage("scss", scss)
hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("xml", xml)
hljs.registerLanguage("yaml", yaml)

type HighlightedCodeProps = Readonly<{
  ariaLabel: string
  className?: string
  emptyDescription: string
  errorDescription?: string
  errorTitle?: string
  highlightLanguage: string
  isFormatting: boolean
  formattingLabel: string
  value: string
}>

function HighlightedCode({
  ariaLabel,
  className,
  emptyDescription,
  errorDescription,
  errorTitle,
  highlightLanguage,
  isFormatting,
  formattingLabel,
  value,
}: HighlightedCodeProps) {
  const highlightedHtml =
    value.trim().length > 0
      ? hljs.highlight(value, { language: highlightLanguage }).value
      : ""

  return (
    <ScrollArea
      role="region"
      aria-label={ariaLabel}
      className={cn(
        "h-[18em] rounded-lg border border-input bg-transparent",
        className
      )}
    >
      {errorDescription ? (
        <div className="flex min-h-full flex-col gap-1 px-3 py-2.5 text-sm">
          {errorTitle ? (
            <p className="font-medium text-destructive">{errorTitle}</p>
          ) : null}
          <p className="break-words whitespace-pre-wrap text-destructive">
            {errorDescription}
          </p>
        </div>
      ) : isFormatting ? (
        <div className="flex min-h-full items-center px-3 py-2.5 text-sm text-muted-foreground">
          {formattingLabel}
        </div>
      ) : value.trim().length === 0 ? (
        <div className="flex min-h-full items-center px-3 py-2.5 text-sm text-muted-foreground">
          {emptyDescription}
        </div>
      ) : (
        <pre className="prettier-highlight min-h-full px-3 py-2.5">
          <code
            className="hljs bg-transparent p-0"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      )}
    </ScrollArea>
  )
}

export { HighlightedCode }
