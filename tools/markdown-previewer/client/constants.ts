import type {
  MarkdownPreviewerStoredState,
  OutputMode,
  ThemeMode,
} from "../types"

const STORAGE_KEY = "tools:markdown-previewer:v1"
const STORAGE_VERSION = 1
const DEFAULT_SCOPE_CLASS_NAME = "markdown-previewer-surface"
const DEFAULT_DOWNLOAD_NAME = "markdown-preview.html"

const DEFAULT_MARKDOWN = `# Markdown Preview

Use this workspace to check how headings, links, code, and tables will render.

## Highlights

- Live preview with optional sanitization
- Outline generated from headings
- HTML export and print-ready output

## Example

### Checklist

- [x] Draft the content
- [ ] Review the preview
- [ ] Export the final HTML

### Code block

\`\`\`ts
export function greet(name: string) {
  return \`Hello, \${name}\`
}
\`\`\`

### Table

| Section | Purpose |
| --- | --- |
| Preview | Review the rendered output |
| HTML | Copy or download the generated document |
`

const DEFAULT_STATE = {
  markdown: DEFAULT_MARKDOWN,
  outputMode: "preview",
  sanitize: true,
  showToc: true,
  theme: "light",
} satisfies MarkdownPreviewerStoredState

function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark"
}

function isOutputMode(value: unknown): value is OutputMode {
  return value === "preview" || value === "html"
}

function readStoredState(
  value: string | null
): MarkdownPreviewerStoredState | null {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(value) as {
      version?: unknown
      markdown?: unknown
      outputMode?: unknown
      sanitize?: unknown
      showToc?: unknown
      theme?: unknown
    }

    if (
      parsed.version !== STORAGE_VERSION ||
      typeof parsed.markdown !== "string" ||
      typeof parsed.sanitize !== "boolean" ||
      typeof parsed.showToc !== "boolean" ||
      !isOutputMode(parsed.outputMode) ||
      !isThemeMode(parsed.theme)
    ) {
      return null
    }

    return {
      markdown: parsed.markdown,
      outputMode: parsed.outputMode,
      sanitize: parsed.sanitize,
      showToc: parsed.showToc,
      theme: parsed.theme,
    }
  } catch {
    return null
  }
}

function serializeStoredState(state: MarkdownPreviewerStoredState): string {
  return JSON.stringify({
    version: STORAGE_VERSION,
    ...state,
  })
}

export {
  DEFAULT_DOWNLOAD_NAME,
  DEFAULT_MARKDOWN,
  DEFAULT_SCOPE_CLASS_NAME,
  DEFAULT_STATE,
  STORAGE_KEY,
  readStoredState,
  serializeStoredState,
}
