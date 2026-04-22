const previewStyles = `
  :root {
    color-scheme: light;
    font-family:
      "IBM Plex Sans", "Segoe UI", sans-serif;
    line-height: 1.65;
    color: #172033;
    background:
      radial-gradient(circle at top left, rgba(74, 132, 255, 0.08), transparent 28%),
      linear-gradient(180deg, #ffffff 0%, #f5f7fb 100%);
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    min-height: 100%;
  }

  body {
    padding: 32px 24px 48px;
  }

  article {
    margin: 0 auto;
    max-width: 760px;
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.96);
    box-shadow:
      0 20px 40px rgba(23, 32, 51, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    padding: 32px;
  }

  h1,
  h2,
  h3,
  h4 {
    font-family:
      "IBM Plex Serif", "Georgia", serif;
    line-height: 1.2;
    color: #101828;
    margin: 1.4em 0 0.5em;
  }

  h1:first-child,
  h2:first-child,
  h3:first-child,
  h4:first-child,
  p:first-child,
  ul:first-child,
  ol:first-child,
  blockquote:first-child,
  pre:first-child {
    margin-top: 0;
  }

  p,
  ul,
  ol,
  blockquote,
  pre,
  table {
    margin: 1em 0;
  }

  a {
    color: #2457d6;
  }

  code,
  pre {
    font-family:
      "IBM Plex Mono", "SFMono-Regular", monospace;
  }

  code {
    border-radius: 8px;
    background: #eef2ff;
    padding: 0.15rem 0.4rem;
    color: #213367;
  }

  pre {
    overflow-x: auto;
    border-radius: 16px;
    background: #111827;
    color: #f8fafc;
    padding: 18px 20px;
  }

  pre code {
    background: transparent;
    color: inherit;
    padding: 0;
  }

  blockquote {
    border-inline-start: 4px solid #7aa2ff;
    padding-inline-start: 16px;
    color: #44516a;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    border-bottom: 1px solid rgba(23, 32, 51, 0.12);
    padding: 10px 12px;
    text-align: left;
  }
`

export { previewStyles }
