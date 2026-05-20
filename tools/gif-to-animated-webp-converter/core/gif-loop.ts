import { normalizeGifToAnimatedWebpOptions } from "./gif-frame-rendering"
import { DEFAULT_LOOP_COUNT } from "./gif-types"

import type { GifToAnimatedWebpOptions } from "./gif-frame-rendering"

function readGifLoopCount(bytes: Uint8Array): number | null {
  const readByte = (index: number) => bytes[index]!

  for (let index = 0; index + 19 <= bytes.length; index += 1) {
    if (
      readByte(index) !== 0x21 ||
      readByte(index + 1) !== 0xff ||
      readByte(index + 2) !== 0x0b
    ) {
      continue
    }

    const identifier = String.fromCharCode(
      readByte(index + 3),
      readByte(index + 4),
      readByte(index + 5),
      readByte(index + 6),
      readByte(index + 7),
      readByte(index + 8),
      readByte(index + 9),
      readByte(index + 10),
      readByte(index + 11),
      readByte(index + 12),
      readByte(index + 13)
    )

    if (identifier !== "NETSCAPE2.0" && identifier !== "ANIMEXTS1.0") {
      continue
    }

    if (readByte(index + 14) < 3 || readByte(index + 15) !== 0x01) {
      continue
    }

    return readByte(index + 16) | (readByte(index + 17) << 8)
  }

  return null
}

function resolveLoopCount(
  bytes: Uint8Array,
  options: Partial<GifToAnimatedWebpOptions>
) {
  const normalized = normalizeGifToAnimatedWebpOptions(options)

  if (normalized.loopMode === "infinite") {
    return 0
  }

  if (normalized.loopMode === "custom") {
    return normalized.loopCount
  }

  return readGifLoopCount(bytes) ?? DEFAULT_LOOP_COUNT
}

export { readGifLoopCount, resolveLoopCount }
