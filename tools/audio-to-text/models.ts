const WHISPER_MODELS = {
  base: {
    name: "Whisper Base",
    repository: "onnx-community/whisper-base",
    revision: "27a07b4b52b3a4c5886134bb4320e93e1a4bbc7c",
    sizes: { q8: 77, q4: 142 },
  },
  small: {
    name: "Whisper Small",
    repository: "onnx-community/whisper-small",
    revision: "36050c46d777d46dc4b5f43f6d90574fc38f8732",
    sizes: { q8: 249, q4: 299 },
  },
  turbo: {
    name: "Whisper Large V3 Turbo",
    repository: "onnx-community/whisper-large-v3-turbo",
    revision: "360ebcde2559d60bb474678be3c1de9ef347d01a",
    sizes: { q4f16: 564, q4: 759 },
  },
} as const

const SENSE_VOICE_LANGUAGES = ["zh", "yue", "en", "ja", "ko"] as const
const QWEN_LANGUAGES: Record<string, string> = {
  ar: "Arabic",
  yue: "Cantonese",
  zh: "Chinese",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  en: "English",
  fil: "Filipino",
  fi: "Finnish",
  fr: "French",
  de: "German",
  el: "Greek",
  hi: "Hindi",
  hu: "Hungarian",
  id: "Indonesian",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  mk: "Macedonian",
  ms: "Malay",
  fa: "Persian",
  pl: "Polish",
  pt: "Portuguese",
  ro: "Romanian",
  ru: "Russian",
  es: "Spanish",
  sv: "Swedish",
  th: "Thai",
  tr: "Turkish",
  vi: "Vietnamese",
}
const QWEN_TIMED_LANGUAGES = "zh yue en fr de it ja ko pt ru es".split(" ")
const MODELS = {
  ...WHISPER_MODELS,
  senseVoice: {
    name: "SenseVoiceSmall",
    repository:
      "csukuangfj/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2025-09-09",
    revision: "355f4d4884d8afd08aef04b9007a8556d7b463b2",
    sizes: { int8: 265 },
  },
  qwenPlain: { name: "Qwen3-ASR 0.6B", sizes: { int8: 1015, q4: 1339 } },
  qwenTimed: { name: "Qwen3-ASR 0.6B", sizes: { int8: 2111, q4: 2414 } },
} as const

type ModelId = keyof typeof MODELS

// Whisper language codes. Other engines add their own supported languages.
const LANGUAGES =
  "af am ar as az ba be bg bn bo br bs ca cs cy da de el en es et eu fa fi fo fr gl gu ha haw he hi hr ht hu hy id is it ja jw ka kk km kn ko la lb ln lo lt lv mg mi mk ml mn mr ms mt my ne nl nn no oc pa pl ps pt ro ru sa sd si sk sl sn so sq sr su sv sw ta te tg th tk tl tr tt uk ur uz vi yi yo zh".split(
    " "
  )

function getSpokenLanguages(lang: string) {
  const names = new Intl.DisplayNames(lang, { type: "language" })
  const collator = new Intl.Collator(lang)
  return Array.from(new Set([...LANGUAGES, ...Object.keys(QWEN_LANGUAGES)]))
    .map((code) => ({
      code,
      name: names.of(code === "jw" ? "jv" : code) ?? code,
    }))
    .sort((a, b) => collator.compare(a.name, b.name))
}

function supportsLanguage(model: ModelId, code: string) {
  switch (model) {
    case "senseVoice":
      return (
        !code || SENSE_VOICE_LANGUAGES.some((supported) => supported === code)
      )
    case "qwenPlain":
      return !code || Object.hasOwn(QWEN_LANGUAGES, code)
    case "qwenTimed":
      return QWEN_TIMED_LANGUAGES.includes(code)
    default:
      return !code || LANGUAGES.includes(code)
  }
}

export {
  getSpokenLanguages,
  MODELS,
  QWEN_LANGUAGES,
  supportsLanguage,
  WHISPER_MODELS,
}
export type { ModelId }
