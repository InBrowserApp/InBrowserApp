import { prepareWebDocument } from "@workspace/web-document"
import { readerStyle } from "./reader-style"
import type { Conversion, Messages, Preview } from "./types"

export function preparePreview(result: Conversion, m: Messages): Preview {
  const preview = prepareWebDocument(result.html, {
    emptyText: m.noContent,
    headingText: m.documentBody,
  })
  // Parse only the already-sanitized document here, preserving its language.
  const inert = new DOMParser().parseFromString(preview.html, "text/html")
  const root = inert.documentElement
  // Secure-mode includes become links. Keep the reference as visible text,
  // without turning an unavailable include into an ordinary external link.
  const includes = root.querySelectorAll("a.include")
  for (const link of includes) {
    link.removeAttribute("data-web-link")
    link.removeAttribute("role")
    link.removeAttribute("tabindex")
    link.setAttribute("title", m.includes)
  }
  const style = inert.createElement("style")
  style.textContent = readerStyle
  root.querySelector("head")!.append(style)
  return {
    ...preview,
    html: "<!doctype html>" + root.outerHTML,
    includes: includes.length > 0,
    warnings: result.warnings,
  }
}
