export const readerStyle = `
  body { max-width: 100ch; padding: 20px !important; font-size: 16px; }
  .nb-cell { margin-block: 0 24px; border-bottom: 1px solid #ddd; padding-bottom: 24px; }
  .nb-label { display: flex; gap: .8em; flex-wrap: wrap; color: #666; font: 12px/1.5 system-ui,sans-serif; margin-block: 0 10px; }
  .nb-label strong { color: #333; }
  .nb-content { min-width: 0; }
  .nb-content > :first-child { margin-top: 0; }
  .nb-content > :last-child { margin-bottom: 0; }
  .nb-output { margin-block: 16px; }
  .nb-output-label { color: #666; font-size: 12px; margin-bottom: 6px; }
  .nb-notice { color: #666; font-size: 13px; }
  .nb-error { border-inline-start: 3px solid #b34332; padding-inline-start: 12px; }
  details.nb-section > summary { cursor: pointer; font: 12px/1.5 system-ui,sans-serif; color: #555; margin-block: 8px; }
  pre { margin: 0; padding: 12px; background: #f5f6f7; font: 13px/1.6 ui-monospace,monospace; tab-size: 4; }
  code { font-family: ui-monospace,monospace; }
  h1 { font-size: 1.9em; } h2 { font-size: 1.5em; }
  h1,h2,h3,h4 { line-height: 1.35; margin-block: 1em .6em; }
  .hljs-keyword,.hljs-selector-tag { color: #7954a1; font-weight: 600; }
  .hljs-string,.hljs-attr { color: #9b4a20; }
  .hljs-number,.hljs-literal { color: #136883; }
  .hljs-comment { color: #68737b; font-style: italic; }
  .hljs-title,.hljs-built_in { color: #285c95; }
  @media(max-width:480px) { body { padding: 16px !important; } }
`
