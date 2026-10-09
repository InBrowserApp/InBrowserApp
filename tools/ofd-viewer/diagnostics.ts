import type { Diagnostic } from "@ofdjs/viewer"
import type { Messages } from "./types"

export function diagnosticMessages(items: Diagnostic[], m: Messages) {
  const messages = new Set<string>()
  for (const item of items) {
    if (item.code === "SIGNATURE_UNSUPPORTED") messages.add(m.signatureNotice)
    else if (item.code === "MULTI_DOCUMENT") messages.add(m.multiDocumentNotice)
    else if (item.code.startsWith("FONT_")) messages.add(m.fontNotice)
    else if (item.code === "IMAGE_DECODE") messages.add(m.imageNotice)
    else if (item.code !== "MISSING_DEFAULT_PAGE_AREA")
      messages.add(m.partialNotice)
  }
  return [...messages]
}
