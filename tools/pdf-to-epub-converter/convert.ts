import {
  createReadingDocument,
  readingPreview,
} from "@workspace/ebook/document"
import { writeEpub } from "@workspace/ebook/write-epub"
import { withOcrWorker } from "@workspace/ocr-models/worker"
import type { Language } from "@workspace/ocr-models/languages"
import { renderPdfScan, withLoadedPdf } from "@workspace/pdf-reader/conversion"
import { openPdfDocument } from "@workspace/pdf-reader/document"
import {
  reflowPdfText,
  reflowRecognizedText,
} from "@workspace/pdf-reader/text-layout"
import { OPS } from "pdfjs-dist"
import { makeBook, readPdfBookmarks, type ReflowPage } from "./book"
import { pdfExtension, type Messages, type Progress } from "./types"

type Options = {
  signal: AbortSignal
  language: Language
  includeEnglish: boolean
  lang: string
  messages: Messages
  onProgress: (progress: Progress) => void
}

const scanImageOps = new Set<number>([
  OPS.paintImageXObject,
  OPS.paintInlineImageXObject,
  OPS.paintInlineImageXObjectGroup,
  OPS.paintImageXObjectRepeat,
  OPS.paintImageMaskXObject,
])

function metadataText(value: unknown): string {
  const first = Array.isArray(value) ? value[0] : value
  return typeof first === "string" ? first.trim() : ""
}

export async function convertPdf(
  source: File,
  { signal, language, includeEnglish, lang, messages: m, onProgress }: Options
) {
  signal.throwIfAborted()
  onProgress({ stage: "opening" })
  const bytes = new Uint8Array(await source.arrayBuffer())
  signal.throwIfAborted()
  const format = new Intl.NumberFormat(lang).format

  const { book, imagePages } = await withLoadedPdf(
    openPdfDocument(bytes),
    signal,
    async (pdf, wait) => {
      const { info, metadata } = await wait(pdf.getMetadata())
      const documentInfo = info as { Title?: unknown; Author?: unknown }
      const title =
        metadataText(documentInfo.Title) ||
        metadataText(metadata?.get("dc:title")) ||
        source.name.replace(pdfExtension, "").trim() ||
        source.name
      const author =
        metadataText(documentInfo.Author) ||
        metadataText(metadata?.get("dc:creator"))
      const bookLanguage =
        metadataText(metadata?.get("dc:language")) || undefined
      const bookmarks = await readPdfBookmarks(pdf, wait)
      const canvas = document.createElement("canvas")
      const pages: ReflowPage[] = []
      const total = pdf.numPages
      let number = 1
      let imagePages = 0
      const recognizing = (fraction: number) =>
        onProgress({ stage: "recognizing", page: number, total, fraction })

      async function* scans() {
        for (; number <= total; number++) {
          signal.throwIfAborted()
          onProgress({ stage: "reading", page: number, total, fraction: 0 })
          const page = await wait(pdf.getPage(number))
          try {
            const text = await wait(page.getTextContent())
            const viewport = page.getViewport({ scale: 1 })
            const blocks = reflowPdfText(text, viewport)
            const pageNumber =
              blocks.length === 1 && /^\p{Nd}{1,6}$/u.test(blocks[0]!.text)
            const scanWithNumber =
              pageNumber &&
              (await wait(page.getOperatorList())).fnArray.some((op) =>
                scanImageOps.has(op)
              )
            if (blocks.length && !scanWithNumber) {
              pages.push({ number, blocks })
            } else {
              const label = scanWithNumber
                ? text.items.find((item) => "str" in item && item.str.trim())
                : null
              const numberAtTop =
                label && "transform" in label
                  ? viewport.convertToViewportPoint(
                      label.transform[4]!,
                      label.transform[5]!
                    )[1]! <
                    viewport.height / 2
                  : false
              yield { page, blocks, numberAtTop }
            }
          } finally {
            page.cleanup()
          }
        }
      }

      const scanPages = scans()
      try {
        let next = await scanPages.next()
        if (!next.done) {
          onProgress({ stage: "loading" })
          await withOcrWorker(
            language,
            includeEnglish,
            signal,
            recognizing,
            async (worker) => {
              while (!next.done) {
                recognizing(0)
                const { page, blocks: native, numberAtTop } = next.value
                await renderPdfScan(page, canvas, signal)
                const { data } = await worker.recognize(canvas)
                signal.throwIfAborted()
                const lines = data.text.trim().split(/\r?\n/)
                const edge = numberAtTop ? 0 : -1
                if (native.length && lines.at(edge)?.trim() === native[0]!.text)
                  lines.splice(edge, 1)
                const blocks = reflowRecognizedText(lines.join("\n"))
                const image = blocks.length
                  ? undefined
                  : canvas.toDataURL("image/jpeg", 0.9)
                if (image) imagePages++
                pages.push({
                  number,
                  blocks: numberAtTop
                    ? [...native, ...blocks]
                    : [...blocks, ...native],
                  image,
                })
                next = await scanPages.next()
              }
            }
          )
        }
      } finally {
        canvas.width = canvas.height = 0
        await scanPages.return(undefined)
      }

      return {
        book: makeBook(
          { title, author, language: bookLanguage },
          pages,
          bookmarks,
          m,
          format
        ),
        imagePages,
      }
    }
  )

  signal.throwIfAborted()
  onProgress({ stage: "saving" })
  const file = await writeEpub(book, signal, m)
  const preview = readingPreview(
    createReadingDocument(book, {
      contents: m.contents,
      supportingSections: m.contents,
    })
  )
  return { file, preview, imagePages }
}
