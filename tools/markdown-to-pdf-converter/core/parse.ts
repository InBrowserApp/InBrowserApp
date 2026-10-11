import { buildMarkdownPreview } from "@workspace/markdown"

export function parse(bytes: Uint8Array) {
  const encoding =
    bytes[0] === 0xff && bytes[1] === 0xfe
      ? "utf-16le"
      : bytes[0] === 0xfe && bytes[1] === 0xff
        ? "utf-16be"
        : "utf-8"
  let source: string
  try {
    source = new TextDecoder(encoding, { fatal: true }).decode(bytes)
  } catch (reason) {
    if (reason instanceof TypeError) throw new Error("encoding")
    throw reason
  }
  // oxlint-disable-next-line no-control-regex
  if (/[\u0000-\u0008\u000e-\u001f]/.test(source)) throw new Error("invalid")
  return buildMarkdownPreview(source, "").html
}
