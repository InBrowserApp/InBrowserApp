import hljs from "highlight.js/lib/core"
import python from "highlight.js/lib/languages/python"
import javascript from "highlight.js/lib/languages/javascript"
import typescript from "highlight.js/lib/languages/typescript"
import json from "highlight.js/lib/languages/json"
import bash from "highlight.js/lib/languages/bash"
import sql from "highlight.js/lib/languages/sql"
import r from "highlight.js/lib/languages/r"
import julia from "highlight.js/lib/languages/julia"
import { escape } from "./text"
for (const [name, grammar] of Object.entries({
  python,
  javascript,
  typescript,
  json,
  bash,
  sql,
  r,
  julia,
}))
  hljs.registerLanguage(name, grammar)
export function code(source: string, language: string) {
  const value = hljs.getLanguage(language)
    ? hljs.highlight(source, { language, ignoreIllegals: true }).value
    : escape(source)
  return `<pre><code>${value}</code></pre>`
}
