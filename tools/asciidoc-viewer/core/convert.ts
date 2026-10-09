import { load, MemoryLogger } from "@asciidoctor/core"

export function decode(bytes: Uint8Array) {
  const encoding =
    bytes[0] === 0xff && bytes[1] === 0xfe
      ? "utf-16le"
      : bytes[0] === 0xfe && bytes[1] === 0xff
        ? "utf-16be"
        : "utf-8"
  let source: string
  try {
    source = new TextDecoder(encoding, { fatal: true }).decode(bytes)
  } catch {
    throw new Error("ENCODING")
  }
  // oxlint-disable-next-line no-control-regex
  if (/[\u0000-\u0008\u000e-\u001f]/.test(source)) throw new Error("INVALID")
  return source
}

export async function convert(source: string) {
  const logger = new MemoryLogger()
  const doc = await load(source, {
    safe: "secure",
    backend: "html5",
    standalone: true,
    logger,
    attributes: {
      "stylesheet!": "",
      nofooter: "",
      "webfonts!": "",
      "icons!": "",
      "source-highlighter!": "",
      "toc!": "",
      "compat-mode!": "",
      "attribute-missing": "warn",
      // Secure mode otherwise silently truncates attribute values at 4 KiB.
      "max-attribute-value-size": null,
    },
  })
  const html = await doc.convert({ standalone: true })
  return { html, warnings: logger.getMessages().length > 0 }
}
