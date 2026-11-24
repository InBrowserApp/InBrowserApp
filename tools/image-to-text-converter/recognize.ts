import { isChinese, type Language } from "@workspace/ocr-models/languages"
import { withOcrWorker } from "@workspace/ocr-models/worker"

export async function recognizeImage(
  image: File,
  language: Language,
  includeEnglish: boolean,
  signal: AbortSignal,
  onProgress: (progress: number) => void
) {
  const { data } = await withOcrWorker(
    language,
    includeEnglish,
    signal,
    onProgress,
    (worker) => worker.recognize(image)
  )
  const text = data.text.trim()
  // Tesseract inserts a single space between adjacent Chinese word segments.
  return isChinese(language)
    ? text.replace(/(\p{Script=Han}) (?=\p{Script=Han})/gu, "$1")
    : text
}
