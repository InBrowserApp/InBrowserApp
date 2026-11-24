import init, { WasmDocument, wasmSimd128Supported } from "djvu-rs"
import scalar from "djvu-rs/scalar/djvu_rs_bg.wasm?url"
import simd from "djvu-rs/simd128/djvu_rs_bg.wasm?url"
import type { Reply, Request } from "./types"

declare const self: DedicatedWorkerGlobalScope

let openedDocument: WasmDocument

function send(reply: Reply, transfer: Transferable[] = []) {
  self.postMessage(reply, transfer)
}

async function open(file: File) {
  try {
    await init(wasmSimd128Supported() ? simd : scalar)
  } catch {
    send({ type: "engineError" })
    return
  }

  try {
    openedDocument = WasmDocument.from_bytes(
      new Uint8Array(await file.arrayBuffer())
    )
    const total = openedDocument.page_count()
    send(total ? { type: "opened", total } : { type: "invalid" })
  } catch {
    send({ type: "invalid" })
  }
}

function render(number: number) {
  try {
    const page = openedDocument.page(number - 1)
    try {
      const nativeDpi = page.dpi()
      const width = page.width_at(nativeDpi)
      const height = page.height_at(nativeDpi)
      // Keep even oversized scans within the canvas dimension supported by iOS.
      const dpi = Math.max(
        1,
        Math.floor(nativeDpi * Math.min(1, 4096 / Math.max(width, height)))
      )
      // The decoder returns a copy in a transferable JavaScript buffer.
      const pixels = page.render(dpi) as Uint8ClampedArray<ArrayBuffer>
      send(
        {
          type: "page",
          page: number,
          width: page.width_at(dpi),
          height: page.height_at(dpi),
          cssWidth: Math.max(1, page.width_at(96)),
          pixels,
        },
        [pixels.buffer]
      )
    } finally {
      page.free()
    }
  } catch {
    send({ type: "pageError", page: number })
  }
}

self.onmessage = ({ data }: MessageEvent<Request>) => {
  if (data.type === "open") void open(data.file)
  else render(data.page)
}
