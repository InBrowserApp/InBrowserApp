import type { Match, Section } from "../types"
export function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
export function sectionHtml(
  section: Section,
  match: Match | null | undefined,
  continued: string
) {
  const digits = String(section.rows.at(-1)?.line ?? 1).length
  const rows = section.rows
    .map((row) => {
      let text = escape(row.text)
      if (match) {
        const start = Math.max(0, match.offset - row.offset)
        const end = Math.min(
          row.text.length,
          match.offset + match.length - row.offset
        )
        if (start < end)
          text =
            escape(row.text.slice(0, start)) +
            `<mark>${escape(row.text.slice(start, end))}</mark>` +
            escape(row.text.slice(end))
      }
      return `<div class="row" id="line-${row.line}"><span class="number" aria-hidden="true" title="${row.continued ? escape(continued) : ""}">${row.line}${row.continued ? "↳" : ""}</span><code dir="auto">${text}</code></div>`
    })
    .join("")
  return `<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><meta charset="utf-8"><style>
  *{box-sizing:border-box}html{font-size:14px}body{margin:0;padding:12px 0 24px;background:#fff;color:#222;font-family:ui-monospace,monospace;line-height:1.6}main{min-width:100%;width:max-content}.row{display:flex;min-height:1.6em}.number{flex:none;width:calc(${digits + 1}ch + 16px);padding-inline:8px;text-align:right;color:#777;background:#f8f9fa;user-select:none;-webkit-user-select:none;pointer-events:none;position:sticky;left:0;font-size:.85em}code{font:inherit;white-space:pre;padding-inline:12px;min-height:1.6em;tab-size:4}html[data-wrap] main{width:auto}html[data-wrap] code{white-space:pre-wrap;overflow-wrap:anywhere;min-width:0;flex:1}mark{color:#181818;background:#ffe58f}.row:focus{outline:2px solid #5282b1;outline-offset:-2px}
  </style></head><body><main>${rows}</main></body></html>`
}
