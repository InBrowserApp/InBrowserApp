import type { ReactNode } from "react"

const SVG_TOKEN_PATTERN = /(<!--[\s\S]*?-->|<\/?[^>]+?>)/g
const TAG_TOKEN_PATTERN =
  /(<!--[\s\S]*?-->|<\/?|\/?>|=|"[^"]*"|'[^']*'|\s+|[^\s=<>]+)/g

type HighlightedSvgMarkupProps = Readonly<{
  ariaLabel: string
  value: string
}>

function tokenSpan(className: string, value: string, key: string) {
  return (
    <span className={className} key={key}>
      {value}
    </span>
  )
}

function renderTag(value: string, keyPrefix: string) {
  const tokens = value.match(TAG_TOKEN_PATTERN) ?? [value]
  let hasTagName = false

  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`

    if (token.startsWith("<!--")) {
      return tokenSpan("hljs-comment", token, key)
    }

    if (token === "<" || token === "</" || token === ">" || token === "/>") {
      return tokenSpan("hljs-punctuation", token, key)
    }

    if (token === "=") {
      return tokenSpan("hljs-punctuation", token, key)
    }

    if (token.startsWith('"') || token.startsWith("'")) {
      return tokenSpan("hljs-string", token, key)
    }

    if (!hasTagName && token.trim()) {
      hasTagName = true
      return tokenSpan("hljs-name", token, key)
    }

    if (token.trim()) {
      return tokenSpan("hljs-attr", token, key)
    }

    return token
  })
}

function renderHighlightedSvg(value: string) {
  const nodes: ReactNode[] = []
  let lastIndex = 0

  for (const match of value.matchAll(SVG_TOKEN_PATTERN)) {
    const [token] = match
    const index = match.index ?? 0

    if (index > lastIndex) {
      nodes.push(value.slice(lastIndex, index))
    }

    if (token.startsWith("<!--")) {
      nodes.push(tokenSpan("hljs-comment", token, `comment-${index}`))
    } else {
      nodes.push(renderTag(token, `tag-${index}`))
    }

    lastIndex = index + token.length
  }

  if (lastIndex < value.length) {
    nodes.push(value.slice(lastIndex))
  }

  return nodes
}

function HighlightedSvgMarkup({ ariaLabel, value }: HighlightedSvgMarkupProps) {
  return (
    <div
      aria-label={ariaLabel}
      className="svg-markup-highlight-surface rounded-lg border border-input bg-transparent px-2.5 py-2"
      role="region"
    >
      <pre className="svg-markup-highlight hljs">
        <code>{renderHighlightedSvg(value)}</code>
      </pre>
    </div>
  )
}

export { HighlightedSvgMarkup }
