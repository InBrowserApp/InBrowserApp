import { inspectPdf, watermarkPdf } from "../core/pdf"
import type { PdfLayer } from "../core/pdf"

type Request = { source: ArrayBuffer } & (
  | { type: "inspect" }
  | {
      type: "generate"
      layers: readonly PdfLayer[]
    }
)
type Response =
  | { ok: false; error: string }
  | { ok: true; pages: Awaited<ReturnType<typeof inspectPdf>> }
  | { ok: true; bytes: Uint8Array<ArrayBuffer> }

async function handleRequest(request: Request): Promise<Response> {
  try {
    if (request.type === "inspect")
      return { ok: true, pages: await inspectPdf(request.source) }
    const bytes = await watermarkPdf(request.source, request.layers)
    return { ok: true, bytes: bytes.slice() }
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error && /encrypt/i.test(error.message)
          ? "encryptedError"
          : request.type === "inspect"
            ? "readError"
            : "generateError",
    }
  }
}

self.addEventListener("message", async (event: MessageEvent<Request>) => {
  const response = await handleRequest(event.data)
  self.postMessage(response, {
    transfer: response.ok && "bytes" in response ? [response.bytes.buffer] : [],
  })
})

export { handleRequest }
export type { Request, Response }
