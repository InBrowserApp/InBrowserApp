import traditionalDictionary from "@pinyin-pro/data/traditional"
import { addTraditionalDict, pinyin } from "pinyin-pro"

export type ToneFormat = "symbol" | "num" | "none"

addTraditionalDict(traditionalDictionary)

const WORD_CHARACTER = /[\p{L}\p{N}]/u
const MARK = /\p{M}/u
const VARIATION_SELECTOR = /\p{Variation_Selector}/u

export function convertToPinyin(input: string, toneType: ToneFormat): string {
  // Spaced array mode returns one reading or original value per code point.
  const syllables = pinyin(input, {
    type: "array",
    nonZh: "spaced",
    toneType,
    traditional: true,
  })
  let output = ""
  let index = 0
  let previousWasPinyin = false
  let previousWasWord = false

  for (const origin of input) {
    const syllable = syllables[index++]
    if (MARK.test(origin)) {
      // An ideograph's variation selector has no meaning on Latin letters.
      if (!previousWasPinyin || !VARIATION_SELECTOR.test(origin)) {
        output += origin
      }
      continue
    }

    const isPinyin = syllable !== origin
    const isWord = isPinyin || WORD_CHARACTER.test(origin)
    if ((previousWasPinyin && isWord) || (isPinyin && previousWasWord)) {
      output += " "
    }

    output += syllable
    previousWasPinyin = isPinyin
    previousWasWord = isWord
  }

  return output
}
