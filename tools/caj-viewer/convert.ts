import {
  convert,
  inspect,
  MAX_ALLOCATION_LIMIT,
  MAX_U64,
} from "caj2pdf-rust/browser"
import type { ConversionReport } from "caj2pdf-rust/browser"
const wasmUrl = new URL("./vendor/caj2pdf_wasm.wasm", import.meta.url)

// These are the engine's integer/ABI bounds, not document quotas. The WASM
// engine's maximum single allocation remains a genuine resource safeguard.
const limits = {
  maxInputBytes: MAX_U64,
  maxOutputBytes: MAX_U64,
  maxPages: 0xffff_ffff,
  maxBookmarks: 0xffff_ffff,
  maxAllocationBytes: MAX_ALLOCATION_LIMIT,
}

export type PreparedDocument = {
  file: Blob
  report: ConversionReport
}

export async function prepareDocument(
  file: File,
  signal: AbortSignal,
  progress: (fraction: number | null) => void
): Promise<PreparedDocument> {
  signal.throwIfAborted()
  let wasm: WebAssembly.Module
  try {
    const response = await fetch(wasmUrl, { signal })
    if (!response.ok) throw new Error("ENGINE_UNAVAILABLE")
    wasm = await WebAssembly.compileStreaming(response)
  } catch (error) {
    signal.throwIfAborted()
    throw new Error("ENGINE_UNAVAILABLE", { cause: error })
  }
  progress(null)
  const info = await inspect(wasm, file, { signal, limits })
  if (info.format === "caa") throw new Error("REFERENCE_ONLY")
  signal.throwIfAborted()
  const chunks: Uint8Array<ArrayBuffer>[] = []
  const report = await convert(
    wasm,
    file,
    {
      async writeChunk(bytes) {
        signal.throwIfAborted()
        chunks.push(bytes as Uint8Array<ArrayBuffer>)
        return bytes.length
      },
      async flush() {},
    },
    {
      signal,
      limits,
      progress,
      includeBookmarks: true,
      allowDamaged: false,
    }
  )
  signal.throwIfAborted()
  if (
    !report.pagesConverted ||
    report.omittedPages.length ||
    (info.pageCount !== null && info.pageCount !== report.pagesConverted)
  )
    throw new Error("MISSING_PAGES")
  return { file: new Blob(chunks, { type: "application/pdf" }), report }
}
