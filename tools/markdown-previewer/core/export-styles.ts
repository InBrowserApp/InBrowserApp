import type { PreviewTheme } from "./preview-options"

const EXPORT_BASE_STYLES = `
  :root {
    color-scheme: light;
    --page-background: #f3efe6;
    --surface-background: #fffdf8;
    --surface-border: rgba(120, 98, 63, 0.18);
    --text-color: #1f2937;
    --muted-color: #6b7280;
    --code-background: rgba(15, 23, 42, 0.06);
    --pre-background: #fff8ef;
    --pre-border: rgba(120, 98, 63, 0.16);
    --link-color: #7c3f00;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background:
      radial-gradient(circle at top, rgba(245, 208, 122, 0.16), transparent 45%),
      var(--page-background);
    color: var(--text-color);
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", sans-serif;
    line-height: 1.7;
  }

  main {
    max-width: 960px;
    margin: 0 auto;
    padding: 48px 24px 72px;
  }

  article {
    border: 1px solid var(--surface-border);
    border-radius: 28px;
    background: var(--surface-background);
    box-shadow: 0 24px 80px -40px rgba(15, 23, 42, 0.35);
    padding: 40px;
  }

  h1,
  h2,
  h3,
  h4 {
    color: var(--text-color);
    font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
    line-height: 1.2;
    margin: 0;
  }

  h1 {
    font-size: 2.25rem;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.6rem;
    margin-top: 2.75rem;
  }

  h3 {
    font-size: 1.2rem;
    margin-top: 2rem;
  }

  h4 {
    font-size: 1rem;
    margin-top: 1.5rem;
  }

  p,
  ul,
  ol,
  blockquote,
  table,
  pre {
    margin: 1rem 0 0;
  }

  ul,
  ol {
    padding-left: 1.5rem;
  }

  li + li {
    margin-top: 0.4rem;
  }

  a {
    color: var(--link-color);
  }

  blockquote {
    border-left: 4px solid var(--surface-border);
    color: var(--muted-color);
    margin-left: 0;
    padding-left: 1rem;
  }

  code {
    background: var(--code-background);
    border-radius: 0.4rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.9em;
    padding: 0.15rem 0.35rem;
  }

  pre {
    overflow-x: auto;
    border: 1px solid var(--pre-border);
    border-radius: 18px;
    background: var(--pre-background);
    padding: 1rem 1.1rem;
  }

  pre code {
    background: transparent;
    border-radius: 0;
    padding: 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    border-bottom: 1px solid var(--surface-border);
    padding: 0.7rem 0.85rem;
    text-align: left;
    vertical-align: top;
  }

  th {
    color: var(--text-color);
    font-weight: 600;
  }

  img {
    max-width: 100%;
    border-radius: 18px;
  }
`

const EXPORT_THEME_STYLES: Readonly<Record<PreviewTheme, string>> = {
  paper: `
    :root {
      color-scheme: light;
    }
  `,
  slate: `
    :root {
      color-scheme: dark;
      --page-background: #020617;
      --surface-background: #0f172a;
      --surface-border: rgba(148, 163, 184, 0.22);
      --text-color: #e5e7eb;
      --muted-color: #cbd5e1;
      --code-background: rgba(255, 255, 255, 0.08);
      --pre-background: #020617;
      --pre-border: rgba(148, 163, 184, 0.28);
      --link-color: #93c5fd;
    }
  `,
}

export { EXPORT_BASE_STYLES, EXPORT_THEME_STYLES }
