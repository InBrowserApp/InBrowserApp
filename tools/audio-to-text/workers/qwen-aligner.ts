import { Tensor } from "onnxruntime-web/wasm"
import type { InferenceSession } from "onnxruntime-web/wasm"

const AUDIO_START = 151669
const AUDIO_END = 151670
const AUDIO_PAD = 151676
const TIMESTAMP = 151705
const TIMESTAMP_STEP_MS = 80
const MEL_BINS = 128

const LANGUAGES = {
  chinese: "zh",
  english: "en",
  cantonese: "yue",
  french: "fr",
  german: "de",
  italian: "it",
  japanese: "ja",
  korean: "ko",
  portuguese: "pt",
  russian: "ru",
  spanish: "es",
} as const

const QWEN_ALIGNMENT_LANGUAGES: readonly string[] = Object.values(LANGUAGES)

function getQwenAlignmentLanguage(language: string) {
  const name = language.trim().toLowerCase()
  const code = LANGUAGES[name as keyof typeof LANGUAGES] ?? name.split("-")[0]
  return code && QWEN_ALIGNMENT_LANGUAGES.includes(code) ? code : undefined
}

type TextUnit = {
  text: string
  startIndex: number
  endIndex: number
}
type QwenAlignedUnit = TextUnit & {
  start: number
  end: number
}

const han = /\p{Script=Han}/u
const keep = /[\p{L}\p{N}']/u

function splitUnits(text: string, language?: string): TextUnit[] {
  if (
    (language === "ja" || language === "ko") &&
    typeof Intl.Segmenter === "function"
  ) {
    const segmenter = new Intl.Segmenter(language, { granularity: "word" })
    return Array.from(segmenter.segment(text)).flatMap(
      ({ segment, index, isWordLike }) => {
        const cleaned = Array.from(segment)
          .filter((char) => keep.test(char))
          .join("")
        return isWordLike && cleaned
          ? [
              {
                text: cleaned,
                startIndex: index,
                endIndex: index + segment.length,
              },
            ]
          : []
      }
    )
  }

  // The Qwen reference uses a timestamp pair for each Han character and each
  // other word. Keep source indices so the subtitle can retain punctuation.
  const units: TextUnit[] = []
  for (const match of text.matchAll(/\S+/gu)) {
    let index = match.index!
    let startIndex = index
    let endIndex = index
    let word = ""

    function flush() {
      if (!word) return
      units.push({ text: word, startIndex, endIndex })
      word = ""
    }

    for (const char of match[0]) {
      if (han.test(char)) {
        flush()
        units.push({
          text: char,
          startIndex: index,
          endIndex: index + char.length,
        })
      } else if (keep.test(char)) {
        if (!word) startIndex = index
        word += char
        endIndex = index + char.length
      }
      index += char.length
    }
    flush()
  }
  return units
}

function int64(values: readonly number[]) {
  return new Tensor("int64", BigInt64Array.from(values, BigInt), [
    1,
    values.length,
  ])
}

function mask(length: number) {
  return new Tensor("int64", new BigInt64Array(length).fill(1n), [1, length])
}

function repairTimestamps(times: number[]) {
  // Keep a longest nondecreasing series as anchors, then fill outliers between
  // them. A single early outlier should not shift every later timestamp.
  const lengths = Array<number>(times.length).fill(1)
  const previous = Array<number>(times.length).fill(-1)
  let last = 0
  for (let index = 1; index < times.length; index++) {
    for (let candidate = 0; candidate < index; candidate++) {
      const length = lengths[candidate]! + 1
      if (times[candidate]! <= times[index]! && length > lengths[index]!) {
        lengths[index] = length
        previous[index] = candidate
      }
    }
    if (lengths[index]! > lengths[last]!) last = index
  }
  const anchors: number[] = []
  for (let index = last; index >= 0; index = previous[index]!) {
    anchors.push(index)
  }
  anchors.reverse()

  const result = times.slice()
  let left = -1
  for (const right of [...anchors, times.length]) {
    const gap = right - left - 1
    for (let index = left + 1; index < right; index++) {
      const before = times[left]
      const after = times[right]
      if (before === undefined || after === undefined) {
        result[index] = before ?? after!
      } else if (gap <= 2) {
        result[index] = index - left <= right - index ? before : after
      } else {
        result[index] = Math.floor(
          before + ((after - before) * (index - left)) / (gap + 1)
        )
      }
    }
    left = right
  }
  return result
}

async function alignQwenChunk(
  session: Pick<InferenceSession, "run">,
  encode: (text: string) => readonly number[],
  inputFeatures: Float32Array,
  frameCount: number,
  text: string,
  language?: string
): Promise<QwenAlignedUnit[]> {
  const code = language ? getQwenAlignmentLanguage(language) : undefined
  if (language && !code) throw new Error("Unsupported Qwen alignment language")
  const units = splitUnits(text, code)
  if (!units.length) return []

  // The Qwen audio stack downsamples in blocks of 100 mel frames. For the
  // remainder, three ceil-by-two convolutions are equivalent to ceil(n / 8).
  const audioCount =
    Math.floor(frameCount / 100) * 13 + Math.ceil((frameCount % 100) / 8)
  const prompt = [
    AUDIO_START,
    ...Array<number>(audioCount).fill(AUDIO_PAD),
    AUDIO_END,
  ]
  const timestampPositions: number[] = []
  for (const unit of units) {
    prompt.push(...encode(unit.text))
    timestampPositions.push(prompt.length, prompt.length + 1)
    prompt.push(TIMESTAMP, TIMESTAMP)
  }

  const { logits } = await session.run({
    input_ids: int64(prompt),
    attention_mask: mask(prompt.length),
    input_features: new Tensor("float32", inputFeatures, [
      1,
      MEL_BINS,
      frameCount,
    ]),
    feature_attention_mask: new Tensor(
      "int32",
      new Int32Array(frameCount).fill(1),
      [1, frameCount]
    ),
  })
  if (!(logits instanceof Tensor))
    throw new Error("Qwen alignment returned no logits")
  let times: number[]
  try {
    const scores = logits.data as Float32Array
    const classes = logits.dims[2]!
    times = timestampPositions.map((position) => {
      const offset = position * classes
      let best = 0
      for (let i = 1; i < classes; i++) {
        if (scores[offset + i]! > scores[offset + best]!) best = i
      }
      return best * TIMESTAMP_STEP_MS
    })
  } finally {
    logits.dispose()
  }
  const repaired = repairTimestamps(times)
  return units.map((unit, index) => ({
    ...unit,
    start: repaired[index * 2]!,
    end: repaired[index * 2 + 1]!,
  }))
}

export { alignQwenChunk, getQwenAlignmentLanguage }
