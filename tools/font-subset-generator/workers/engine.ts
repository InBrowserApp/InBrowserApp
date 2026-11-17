import { init, subset } from "hb-subset-wasm"
import { compress, decompress } from "woff2-encoder"

import { fontKind, readFont } from "../core/font"
import { characters, subsetCharacters } from "../core/subset"
import { decodeWoff } from "../core/woff"
import type { SubsetOutput, SubsetRequest } from "../types"

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
  const unicodes = subsetCharacters(text).filter(source.hasCharacter)
  if (!unicodes.length) throw new Error("NO_CHARACTERS")
  const missing = characters(text).filter(
    (cp) =>
      !source.hasCharacter(cp) &&
      !/\p{Default_Ignorable_Code_Point}/u.test(String.fromCodePoint(cp))
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
