import { readOdt } from "odf-kit/odt/read"
import { renderOdtHtml } from "odf-kit/odt/to-html"
import { preflight } from "./preflight"
import type { OdtDocument, PagePart } from "./types"

export function parseOdt(buffer: ArrayBuffer): OdtDocument {
  const checked = preflight(new Uint8Array(buffer))
  const model = readOdt(checked.bytes, { trackedChanges: "final" })
  const parts: OdtDocument["parts"] = {}
  for (const part of [
    "header",
    "footer",
    "firstPageHeader",
    "firstPageFooter",
  ] satisfies PagePart[]) {
    if (model[part]?.length)
      parts[part] = renderOdtHtml(model[part]!, { fragment: true })
  }
  return {
    html: model.toHtml({ fragment: true }),
    parts,
    title: model.metadata.title ?? "",
    template: checked.template,
    limited: checked.limited,
    breaks: checked.breaks,
  }
}
