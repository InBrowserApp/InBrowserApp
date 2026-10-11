import * as CFB from "cfb"
import { inspect } from "./inspect"
import { ConversionError, failure } from "./errors"

export function preflight(bytes: ArrayBuffer) {
  try {
    const input = new Uint8Array(bytes)
    const signature = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]
    if (
      input.length < 512 ||
      signature.some((byte, index) => input[index] !== byte)
    )
      throw new ConversionError("invalid")
    const container = CFB.read(input, { type: "array" })
    if (
      CFB.find(container, "EncryptedSummary") ||
      CFB.find(container, "EncryptedPackage")
    )
      throw new ConversionError("protected")
    const current = CFB.find(container, "Current User")?.content
    const document = CFB.find(container, "PowerPoint Document")?.content
    if (!current || current.length < 20 || !document?.length)
      throw new ConversionError("invalid")
    const user = new Uint8Array(current)
    if (new DataView(user.buffer).getUint32(12, true) === 0xf3d1c4df)
      throw new ConversionError("protected")
    const pictures = CFB.find(container, "Pictures")?.content
    return inspect(
      new Uint8Array(document),
      user,
      pictures ? new Uint8Array(pictures) : new Uint8Array()
    )
  } catch (error) {
    throw failure(error)
  }
}
