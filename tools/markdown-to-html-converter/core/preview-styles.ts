const previewStyles = `
  :root {
    color-scheme: light;
    font-family:
      "IBM Plex Sans", "Segoe UI", sans-serif;
    line-height: 1.65;
    color: #172033;
    background: #ffffff;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    min-height: 100%;
    background: #ffffff;
  }

  body {
    padding: 0;
  }

  article {
    min-height: 100vh;
    margin: 0 auto;
    width: min(100%, 840px);
    background: #ffffff;
    padding: 28px 22px 44px;
  }

  @media (min-width: 720px) {
    article {
      padding: 36px 32px 52px;
    }
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
    background: #f3f4f6;
    padding: 0.15rem 0.4rem;
    color: #1f2937;
  }

  pre {
    overflow-x: auto;
    border-radius: 16px;
    border: 1px solid rgba(23, 32, 51, 0.12);
    background: #f8fafc;
    color: #172033;
    padding: 18px 20px;
  }

  pre code {
    background: transparent;
    color: inherit;
    padding: 0;
  }

  blockquote {
    border-inline-start: 4px solid #d0d5dd;
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
