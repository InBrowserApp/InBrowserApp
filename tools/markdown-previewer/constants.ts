import type { PreviewMode, PreviewTheme } from "./core/preview-options"

const DEFAULT_PREVIEW_MODE: PreviewMode = "split"
const DEFAULT_PREVIEW_THEME: PreviewTheme = "paper"

const DEFAULT_MARKDOWN = `# Product launch checklist

Launch notes for the next release stay in Markdown until the draft is ready to
publish.

## Highlights
- Faster onboarding flow
- New keyboard shortcuts
- Print-friendly HTML export

## Release plan
| Milestone | Owner | Status |
| --- | --- | --- |
| Draft copy | Content | Done |
| QA preview | Product | In review |
| Publish docs | Marketing | Pending |

## Snippet
\`\`\`ts
export function greet(name: string) {
  return \`Hello, \${name}!\`
}
\`\`\`

## Follow-up
1. Publish the README
2. Share the changelog
3. Print a copy for review

> Markdown is easiest to proof when you can see the structure and the rendered
> result at the same time.
`

const STORAGE_KEYS = {
  markdown: "tools:markdown-previewer:markdown",
  previewMode: "tools:markdown-previewer:preview-mode",
  previewTheme: "tools:markdown-previewer:preview-theme",
  sanitizeHtml: "tools:markdown-previewer:sanitize-html",
  showOutline: "tools:markdown-previewer:show-outline",
} as const

const IMPORT_ACCEPT = ".md,.markdown,.mdown,.txt,text/markdown,text/plain"

export {
  DEFAULT_MARKDOWN,
  DEFAULT_PREVIEW_MODE,
  DEFAULT_PREVIEW_THEME,
  IMPORT_ACCEPT,
  STORAGE_KEYS,
}
