import { DEFAULT_HTML_TO_MARKDOWN_OPTIONS } from "../core/html-to-markdown"

const DEFAULT_HTML = [
  "<article>",
  "  <h1>Release checklist</h1>",
  "  <p>Turn copied HTML into clean Markdown for docs, READMEs, or knowledge base notes.</p>",
  "  <ul>",
  "    <li>Import exported snippets from a CMS</li>",
  "    <li>Normalize copied markup before committing it</li>",
  "    <li>Keep code samples readable in Markdown</li>",
  "  </ul>",
  '  <pre><code class="language-bash">pnpm build',
  "pnpm test",
  "pnpm lint</code></pre>",
  "</article>",
].join("\n")

const STORAGE_KEYS = {
  htmlText: "tools:html-to-markdown-converter:html-text",
  headingStyle: "tools:html-to-markdown-converter:heading-style",
  bulletListMarker: "tools:html-to-markdown-converter:bullet-list-marker",
  codeBlockStyle: "tools:html-to-markdown-converter:code-block-style",
} as const

const DEFAULT_UI_STATE = {
  htmlText: DEFAULT_HTML,
  headingStyle: DEFAULT_HTML_TO_MARKDOWN_OPTIONS.headingStyle,
  bulletListMarker: DEFAULT_HTML_TO_MARKDOWN_OPTIONS.bulletListMarker,
  codeBlockStyle: DEFAULT_HTML_TO_MARKDOWN_OPTIONS.codeBlockStyle,
} as const

export { DEFAULT_UI_STATE, STORAGE_KEYS }
