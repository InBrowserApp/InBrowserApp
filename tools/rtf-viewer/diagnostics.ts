import type { Diagnostic } from "rtf-viewer"
import type { Messages } from "./types"

export function diagnosticMessages(
  diagnostics: readonly Diagnostic[],
  m: Messages
) {
  const messages = new Set<string>()
  for (const { code, message } of diagnostics) {
    if (code === "system-font-environment") continue
    if (/image|picture|metafile/.test(code)) messages.add(m.imageNote)
    else if (/decod|codepage|bidirectional|associated-font/.test(code))
      messages.add(m.encodingNote)
    else if (/destination/.test(code) && /\\(?:object|fldinst)\b/.test(message))
      messages.add(m.objectNote)
    else messages.add(m.partial)
  }
  return [...messages]
}
