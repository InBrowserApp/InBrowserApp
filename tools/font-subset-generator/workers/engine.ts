import { init, subset } from "hb-subset-wasm"
import { compress, decompress } from "woff2-encoder"

import { fontKind, readFont } from "../core/font"
import { characters, subsetCharacters } from "../core/subset"
import { decodeWoff } from "../core/woff"
import type { SubsetOutput, SubsetRequest } from "../types"

function isDefaultIgnorable(cp: number) {
  return /\p{Default_Ignorable_Code_Point}/u.test(String.fromCodePoint(cp))
}

export async function generateSubset(
  { input, text, format }: SubsetRequest,
  wasm: Parameters<typeof init>[0]
): Promise<SubsetOutput> {
  if (!text.trim()) throw new Error("EMPTY_TEXT")
  let bytes = new Uint8Array(input)
  const kind = fontKind(bytes)
  if (kind === "woff2") bytes = new Uint8Array(await decompress(bytes))
  if (kind === "woff") bytes = decodeWoff(bytes)
  const source = readFont(bytes)
  const requested = subsetCharacters(text)
  if (!requested.some(source.hasCharacter)) throw new Error("NO_CHARACTERS")
  // Variation selectors live in cmap format 14 rather than the nominal cmap.
  // HarfBuzz needs them in the Unicode set to preserve variation sequences.
  const unicodes = requested.filter(
    (cp) => source.hasCharacter(cp) || isDefaultIgnorable(cp)
  )
  const missing = characters(text).filter(
    (cp) => !source.hasCharacter(cp) && !isDefaultIgnorable(cp)
  )
  await init(wasm)
  const sfnt = await subset(bytes, { unicodes, layoutFeatures: "*" })
  const details = readFont(sfnt).details
  const output = format === "woff2" ? await compress(sfnt) : sfnt
  return {
    ...details,
    output: new Uint8Array(output).buffer,
    originalGlyphCount: source.details.glyphCount,
    missing,
    unicodes,
  }
}
