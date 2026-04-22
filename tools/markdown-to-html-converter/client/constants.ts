const DEFAULT_SAMPLE_MARKDOWN = `# Launch notes

Markdown stays easy to write, and HTML gives you final markup you can ship.

## This sample includes

- headings
- emphasis and **strong text**
- lists and links

> Toggle sanitization when you need to inspect the raw fragment.

[Read the docs](https://www.markdownguide.org/)`

const STORAGE_KEYS = {
  markdown: "tools:markdown-to-html-converter:markdown",
  sanitize: "tools:markdown-to-html-converter:sanitize",
} as const

export { DEFAULT_SAMPLE_MARKDOWN, STORAGE_KEYS }
