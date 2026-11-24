import { openPdfDocument } from "@workspace/pdf-reader/document"
import { PDFDocument } from "pdf-lib"
import type { PDFPageProxy } from "pdfjs-dist"

import {
  addArchivePage,
  maxPageSize,
  maxPdfa1Pages,
  minPageSize,
  saveArchive,
  type Profile,
} from "./archive"
import { validateArchive } from "./validate"

export type Progress =
  | { stage: "rendering"; page: number; total: number }
  | { stage: "checking" }

type Result =
  | { status: "ready"; blob: Blob }
  | { status: "invalid" | "encrypted" | "xfa" | "checkFailed" }

type Options = {
  profile: Profile
  signal: AbortSignal
  onProgress: (progress: Progress) => void
}

export async function convertPdf(
  file: File,
  { profile, signal, onProgress }: Options
): Promise<Result> {
  const bytes = new Uint8Array(await file.arrayBuffer())
  signal.throwIfAborted()
  const task = openPdfDocument(bytes)
  // PDF.js can leave work pending when its worker is destroyed.
  let rejectRead!: (reason: unknown) => void
  const aborted = new Promise<never>((_, reject) => {
    rejectRead = reject
  })
  const stop = () => rejectRead(signal.reason)
  const waitForRead = <T>(request: Promise<T>) =>
    Promise.race([request, aborted])
  signal.addEventListener("abort", stop, { once: true })
  const canvas = document.createElement("canvas")

  try {
    const input = await waitForRead(task.promise).catch((error: unknown) => {
      signal.throwIfAborted()
      return error instanceof Error && error.name === "PasswordException"
        ? "encrypted"
        : "invalid"
    })
    if (typeof input === "string") return { status: input }
    if (!input.numPages) return { status: "invalid" }
    if (profile === 1 && input.numPages > maxPdfa1Pages) {
      return { status: "checkFailed" }
    }
    const { info } = await waitForRead(input.getMetadata())
    const { IsXFAPresent, IsAcroFormPresent } = info as {
      IsXFAPresent?: boolean
      IsAcroFormPresent?: boolean
    }
    if (IsXFAPresent && !IsAcroFormPresent) return { status: "xfa" }

    const archive = await PDFDocument.create({ updateMetadata: false })
    for (let index = 1; index <= input.numPages; index += 1) {
      signal.throwIfAborted()
      onProgress({ stage: "rendering", page: index, total: input.numPages })
      const page = await waitForRead(input.getPage(index))
      try {
        const { width, height } = page.getViewport({ scale: 1 })
        const short = Math.min(width, height)
        const long = Math.max(width, height)
        if (!(short > 0) || long / short > maxPageSize / minPageSize) {
          return { status: "checkFailed" }
        }
        // Scale nonstandard page sizes proportionally into the archival range.
        const scale = Math.max(
          minPageSize / short,
          Math.min(1, maxPageSize / long)
        )
        const bound = (size: number) =>
          Math.max(minPageSize, Math.min(maxPageSize, size * scale))
        const jpeg = await renderPage(page, canvas, signal, width, height)
        await addArchivePage(archive, jpeg, bound(width), bound(height))
      } finally {
        page.cleanup()
      }
    }

    signal.throwIfAborted()
    const output = await saveArchive(archive, profile)
    signal.throwIfAborted()
    onProgress({ stage: "checking" })
    if (!(await validateArchive(output, profile, input.numPages))) {
      return { status: "checkFailed" }
    }
    signal.throwIfAborted()
    return {
      status: "ready",
      blob: new Blob([new Uint8Array(output)], { type: "application/pdf" }),
    }
  } finally {
    signal.removeEventListener("abort", stop)
    canvas.width = canvas.height = 0
    await task.destroy().catch(() => {})
  }
}

async function renderPage(
  page: PDFPageProxy,
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
  width: number,
  height: number
) {
  // Aim for 216 DPI without exceeding the canvas limits on large pages.
  const viewport = page.getViewport({
    scale: Math.min(
      3,
      4096 / Math.max(width, height),
      Math.sqrt(12_000_000 / (width * height))
    ),
  })
  canvas.width = Math.ceil(viewport.width)
  canvas.height = Math.ceil(viewport.height)
  const render = page.render({
    canvas,
    viewport,
    transform: [
      canvas.width / viewport.width,
      0,
      0,
      canvas.height / viewport.height,
      0,
      0,
    ],
    background: "#fff",
  })
  const cancel = () => render.cancel()
  signal.addEventListener("abort", cancel, { once: true })
  try {
    await render.promise
  } finally {
    signal.removeEventListener("abort", cancel)
  }
  const image = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Could not encode page"))
      },
      "image/jpeg",
      0.95
    )
  })
  signal.throwIfAborted()
  return new Uint8Array(await image.arrayBuffer())
}
