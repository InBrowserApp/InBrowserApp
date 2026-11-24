import {
  getSpokenLanguages as spokenLanguages,
  LANGUAGES,
  WHISPER_MODELS,
} from "@workspace/local-speech"

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
    name: "SenseVoiceSmall (CPU)",
    repository:
      "csukuangfj/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2025-09-09",
    revision: "355f4d4884d8afd08aef04b9007a8556d7b463b2",
    sizes: { int8: 265 },
  },
  senseVoiceGpu: {
    name: "SenseVoiceSmall (WebGPU)",
    repository: "neavo/SenseVoiceSmall-ONNX-WebGPU-W8A32",
    revision: "a212f4c6549d5af5ff3dc5e7e71c2d1a7b4fd5ce",
    sizes: { int8: 290 },
  },
  qwenPlain: { name: "Qwen3-ASR 0.6B", sizes: { int8: 1015, q4: 1339 } },
  qwenTimed: { name: "Qwen3-ASR 0.6B", sizes: { int8: 2111, q4: 2414 } },
} as const

type ModelId = keyof typeof MODELS

function getSpokenLanguages(lang: string) {
  return spokenLanguages(
    lang,
    Array.from(new Set([...LANGUAGES, ...Object.keys(QWEN_LANGUAGES)]))
  )
}

function supportsLanguage(model: ModelId, code: string) {
  switch (model) {
    case "senseVoice":
    case "senseVoiceGpu":
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

export { getSpokenLanguages, MODELS, QWEN_LANGUAGES, supportsLanguage }
export type { ModelId }
