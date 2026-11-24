import { openPdfDocument } from "@workspace/pdf-reader/document"

import type { EngineResult, Profile } from "./engine/protocol"
import { runEngine } from "./engine/run"
import { validateArchive } from "./validate"

export type Progress = "converting" | "checking"

type Result =
  | { status: "ready"; blob: Blob }
  | Exclude<EngineResult, { status: "ready" }>
  | { status: "contentChanged" | "xfa" }

export type ConversionError = Exclude<Result, { status: "ready" }>["status"]

type Options = {
  profile: Profile
  signal: AbortSignal
  onProgress: (progress: Progress) => void
}

export async function convertPdf(
  file: File,
  { profile, signal, onProgress }: Options
): Promise<Result> {
  signal.throwIfAborted()
  const bytes = await file.arrayBuffer()
  signal.throwIfAborted()
  // The reader and conversion workers each take ownership of their buffer.
  const source = openPdfDocument(new Uint8Array(bytes.slice(0)))
  let output: ReturnType<typeof openPdfDocument> | undefined

  let rejectRead!: (reason: unknown) => void
  const aborted = new Promise<never>((_, reject) => {
    rejectRead = reject
  })
  const stop = () => rejectRead(signal.reason)
  const waitForRead = <T>(request: Promise<T>) =>
    Promise.race([request, aborted])
  signal.addEventListener("abort", stop, { once: true })

  try {
    const original = await waitForRead(source.promise).catch(
      (error: unknown) => {
        signal.throwIfAborted()
        return error instanceof Error && error.name === "PasswordException"
          ? "encrypted"
          : "invalid"
      }
    )
    if (typeof original === "string") return { status: original }
    if (!original.numPages) return { status: "invalid" }

    const { info } = await waitForRead(original.getMetadata())
    const { IsXFAPresent, IsAcroFormPresent } = info as {
      IsXFAPresent?: boolean
      IsAcroFormPresent?: boolean
    }
    if (IsXFAPresent && !IsAcroFormPresent) return { status: "xfa" }

    onProgress("converting")
    const result = await runEngine({ bytes, profile }, signal)
    if (result.status !== "ready") return result

    onProgress("checking")
    const blob = new Blob([result.bytes], { type: "application/pdf" })
    try {
      output = openPdfDocument(new Uint8Array(result.bytes))
      const copy = await waitForRead(output.promise)
      const status = await waitForRead(
        validateArchive(original, copy, {
          profile,
          fontEncodingChanged: result.fontEncodingChanged,
        })
      )
      return status === "ready" ? { status, blob } : { status }
    } catch {
      signal.throwIfAborted()
      return { status: "checkFailed" }
    }
  } finally {
    signal.removeEventListener("abort", stop)
    await Promise.allSettled([source.destroy(), output?.destroy()])
  }
}
