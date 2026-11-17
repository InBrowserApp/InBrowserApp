export type Representation = "hex" | "base64" | "base64url"
export const MAX_BYTES = 1024 * 1024

export function checkSize(size: number, limit = MAX_BYTES) {
  if (size > limit) throw new Error("Input exceeds the 1 MiB limit.")
}

export function formatBytes(bytes: Uint8Array, format: Representation): string {
  if (format === "hex") {
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
      " "
    )
  }
  let text = ""
  for (let i = 0; i < bytes.length; i += 8192) {
    text += String.fromCharCode(...bytes.subarray(i, i + 8192))
  }
  const base64 = btoa(text)
  return format === "base64"
    ? base64
    : base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

export function parseBytes(input: string, format: Representation): Uint8Array {
  checkSize(input.length, MAX_BYTES * 3 + 16)
  let text = input.replace(/\s/g, "")
  if (format === "hex") {
    text = text.replace(/^0x/i, "")
    if (!text || text.length % 2 || !/^[\da-f]+$/i.test(text)) {
      throw new Error("Hex must contain complete byte pairs (00–ff).")
    }
    checkSize(text.length / 2)
    return Uint8Array.from(text.match(/../g)!, (pair) => parseInt(pair, 16))
  }
  const pattern =
    format === "base64" ? /^[A-Za-z0-9+/]*={0,2}$/ : /^[A-Za-z0-9_-]*={0,2}$/
  if (
    !text ||
    !pattern.test(text) ||
    text.length % 4 === 1 ||
    (text.includes("=") && text.length % 4 !== 0)
  ) {
    throw new Error("Invalid Base64 alphabet, padding, or length.")
  }
  text = text.replace(/-/g, "+").replace(/_/g, "/")
  const bytes = Uint8Array.from(atob(text), (char) => char.charCodeAt(0))
  checkSize(bytes.length)
  if (
    formatBytes(bytes, "base64").replace(/=+$/, "") !== text.replace(/=+$/, "")
  ) {
    throw new Error("Base64 has non-zero padding bits.")
  }
  return bytes
}
